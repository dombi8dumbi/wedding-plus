import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../data/db.json");
const jwtSecret = process.env.JWT_SECRET || "wedding-plus-demo-secret";

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}
function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}
function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function tokenFor(user) {
  return jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: "1d" });
}
function safeUser(user, db) {
  const { passwordHash, ...clean } = user;
  return { ...clean, weddings: db.weddings.filter(w => w.owner === user._id || w._id === user.weddingId || w._id === "demo-wedding") };
}
function auth(req, res, next) {
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";
  if (!token) return res.status(401).json({ success: false, message: "Authentification requise" });
  try {
    req.auth = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Session invalide ou expirée" });
  }
}

router.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message:"Nom, e-mail et mot de passe requis" });
    const db = readDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ success:false, message:"Un compte existe déjà avec cet e-mail" });
    const user = {_id:id("user"), name, email:email.toLowerCase(), passwordHash:await bcrypt.hash(password,10), role:"user", weddingId:"demo-wedding", createdAt:new Date().toISOString()};
    db.users.push(user);
    writeDB(db);
    res.status(201).json({ success:true, data:{ user:safeUser(user,db), token:tokenFor(user) } });
  } catch (error) { next(error); }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === String(email||"").toLowerCase());
    if (!user || !(await bcrypt.compare(String(password||""), user.passwordHash))) return res.status(401).json({ success:false, message:"E-mail ou mot de passe incorrect" });
    res.json({ success:true, data:{ user:safeUser(user,db), token:tokenFor(user) } });
  } catch (error) { next(error); }
});

router.get("/auth/me", auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u._id === req.auth.id);
  if (!user) return res.status(404).json({ success:false, message:"Utilisateur introuvable" });
  res.json({ success:true, data:safeUser(user,db) });
});

const resources = ["weddings","tasks","guests","vendors","budget","timeline","alerts"];
for (const resource of resources) {
  router.get(`/${resource}`, (req, res) => {
    const db = readDB();
    let rows = db[resource] || [];
    if (req.query.wedding) rows = rows.filter(x => x.wedding === req.query.wedding || x._id === req.query.wedding);
    res.json({ success:true, data:rows });
  });

  router.post(`/${resource}`, (req, res) => {
    const db = readDB();
    const row = {_id:id(resource), ...req.body, createdAt:new Date().toISOString()};
    db[resource] = db[resource] || [];
    db[resource].unshift(row);
    writeDB(db);
    res.status(201).json({ success:true, data:row });
  });

  router.put(`/${resource}/:id`, (req, res) => {
    const db = readDB();
    const rows = db[resource] || [];
    const index = rows.findIndex(x => x._id === req.params.id);
    if (index < 0) return res.status(404).json({ success:false, message:"Ressource introuvable" });
    rows[index] = {...rows[index], ...req.body, updatedAt:new Date().toISOString()};
    db[resource] = rows;
    writeDB(db);
    res.json({ success:true, data:rows[index] });
  });

  router.delete(`/${resource}/:id`, (req, res) => {
    const db = readDB();
    const rows = db[resource] || [];
    const exists = rows.some(x => x._id === req.params.id);
    if (!exists) return res.status(404).json({ success:false, message:"Ressource introuvable" });
    db[resource] = rows.filter(x => x._id !== req.params.id);
    writeDB(db);
    res.json({ success:true, message:"Suppression effectuée" });
  });
}

router.get("/dashboard/:weddingId", (req, res) => {
  const db = readDB();
  const wedding = db.weddings.find(w => w._id === req.params.weddingId) || db.weddings[0];
  if (!wedding) return res.status(404).json({ success:false, message:"Mariage introuvable" });
  const filter = name => (db[name]||[]).filter(x => x.wedding === wedding._id);
  const tasks=filter("tasks"), guests=filter("guests"), vendors=filter("vendors"), budget=filter("budget"), timeline=filter("timeline"), alerts=filter("alerts");
  const spent=budget.reduce((sum,x)=>sum+Number(x.actual||0),0);
  const estimated=budget.reduce((sum,x)=>sum+Number(x.estimated||0),0);
  res.json({success:true,data:{wedding,stats:{tasks:{completed:tasks.filter(x=>x.status==="done").length,total:tasks.length},guests:{confirmed:guests.filter(x=>x.rsvp==="confirmed").length,total:guests.length},vendors:{booked:vendors.filter(x=>["booked","paid"].includes(x.status)).length,total:vendors.length},budget:{spent,estimated,target:wedding.budgetTarget},unreadAlerts:alerts.filter(x=>!x.read).length},nextTasks:tasks.filter(x=>x.status!=="done").slice(0,5),timeline:timeline.slice(0,8)}});
});

router.get("/demo/database", (_req, res) => {
  const db = readDB();
  res.json({ success:true, data:{...db, users:db.users.map(({passwordHash,...u})=>u)} });
});

export default router;
