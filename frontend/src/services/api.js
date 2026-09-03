const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("weddingPlusToken");
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("weddingPlusUser") || "null"); }
  catch { return null; }
}

export function getWeddingId() {
  const user = getCurrentUser();
  const first = user?.weddings?.[0];
  return typeof first === "string" ? first : first?._id || null;
}

export function setSession({ token, user }) {
  localStorage.setItem("weddingPlusToken", token);
  localStorage.setItem("weddingPlusUser", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("weddingPlusToken");
  localStorage.removeItem("weddingPlusUser");
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Une erreur est survenue");
  return payload;
}

export const authApi = {
  login: (email, password) => api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => api("/auth/me")
};

export const weddingApi = {
  dashboard: (weddingId) => api(`/dashboard/${weddingId}`),
  list: () => api("/weddings"),
  create: (data) => api("/weddings", { method: "POST", body: JSON.stringify(data) })
};

export function crudApi(resource) {
  return {
    list: (wedding) => api(`/${resource}${wedding ? `?wedding=${wedding}` : ""}`),
    create: (data) => api(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => api(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => api(`/${resource}/${id}`, { method: "DELETE" })
  };
}
