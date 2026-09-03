const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true";
const DEMO_WEDDING_ID = "demo-wedding";

function getToken() { return localStorage.getItem("weddingPlusToken"); }
export function getCurrentUser() { try { return JSON.parse(localStorage.getItem("weddingPlusUser") || "null"); } catch { return null; } }
export function getWeddingId() {
  const user = getCurrentUser();
  const first = user?.weddings?.[0];
  return typeof first === "string" ? first : first?._id || DEMO_WEDDING_ID;
}
export function setSession({ token, user }) {
  localStorage.setItem("weddingPlusToken", token);
  localStorage.setItem("weddingPlusUser", JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem("weddingPlusToken");
  localStorage.removeItem("weddingPlusUser");
}

function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }
function ensureDemoStore() {
  if (localStorage.getItem("weddingPlusDemoStore")) return;
  const wedding = {_id:DEMO_WEDDING_ID,title:"Notre mariage",partner1:"Glorie",partner2:"Jordan",date:"2027-06-12T14:00:00.000Z",location:"Domaine de la Roseraie, Paris",budgetTarget:20000,guestTarget:150,status:"planning"};
  localStorage.setItem("weddingPlusDemoStore", JSON.stringify({
    weddings:[wedding],
    tasks:[
      {_id:"task-1",wedding:DEMO_WEDDING_ID,title:"Confirmer le traiteur",dueDate:"2026-09-18",priority:"high",status:"todo"},
      {_id:"task-2",wedding:DEMO_WEDDING_ID,title:"Envoyer les invitations",dueDate:"2026-09-25",priority:"high",status:"in-progress"},
      {_id:"task-3",wedding:DEMO_WEDDING_ID,title:"Essai coiffure",dueDate:"2026-10-02",priority:"medium",status:"todo"},
      {_id:"task-4",wedding:DEMO_WEDDING_ID,title:"Réserver le photographe",dueDate:"2026-10-12",priority:"medium",status:"done"}
    ],
    guests:[
      {_id:"guest-1",wedding:DEMO_WEDDING_ID,firstName:"Aïcha",lastName:"Diop",group:"Famille",rsvp:"confirmed",tableName:"Élégance"},
      {_id:"guest-2",wedding:DEMO_WEDDING_ID,firstName:"Samuel",lastName:"Kouassi",group:"Amis",rsvp:"pending",tableName:""},
      {_id:"guest-3",wedding:DEMO_WEDDING_ID,firstName:"Marie",lastName:"Lemoine",group:"Amis",rsvp:"confirmed",tableName:"Harmonie"},
      {_id:"guest-4",wedding:DEMO_WEDDING_ID,firstName:"Jean",lastName:"Dupont",group:"Collègues",rsvp:"declined",tableName:""}
    ],
    vendors:[
      {_id:"vendor-1",wedding:DEMO_WEDDING_ID,name:"Traiteur Délice",category:"Traiteur",price:3200,status:"booked"},
      {_id:"vendor-2",wedding:DEMO_WEDDING_ID,name:"Fleurs d'Eden",category:"Décoration",price:1800,status:"booked"},
      {_id:"vendor-3",wedding:DEMO_WEDDING_ID,name:"Studio Lumière",category:"Photo & Vidéo",price:1200,status:"paid"},
      {_id:"vendor-4",wedding:DEMO_WEDDING_ID,name:"DJ Harmony",category:"Animation",price:900,status:"contacted"}
    ],
    budget:[
      {_id:"budget-1",wedding:DEMO_WEDDING_ID,label:"Location du domaine",category:"Lieu",estimated:6000,actual:4000,paid:true},
      {_id:"budget-2",wedding:DEMO_WEDDING_ID,label:"Menu réception",category:"Traiteur",estimated:5000,actual:3200},
      {_id:"budget-3",wedding:DEMO_WEDDING_ID,label:"Tenues",category:"Tenues",estimated:3000,actual:2000},
      {_id:"budget-4",wedding:DEMO_WEDDING_ID,label:"Fleurs et décoration",category:"Décoration",estimated:2500,actual:1500},
      {_id:"budget-5",wedding:DEMO_WEDDING_ID,label:"Photo & vidéo",category:"Photo & Vidéo",estimated:1500,actual:750}
    ],
    timeline:[
      {_id:"timeline-1",wedding:DEMO_WEDDING_ID,title:"Préparatifs",startTime:"2027-06-12T08:00:00.000Z",responsible:"Wedding planner",status:"planned"},
      {_id:"timeline-2",wedding:DEMO_WEDDING_ID,title:"Cérémonie",startTime:"2027-06-12T14:00:00.000Z",location:"Domaine de la Roseraie",status:"planned"},
      {_id:"timeline-3",wedding:DEMO_WEDDING_ID,title:"Cocktail",startTime:"2027-06-12T16:00:00.000Z",location:"Jardin",status:"planned"},
      {_id:"timeline-4",wedding:DEMO_WEDDING_ID,title:"Dîner & soirée",startTime:"2027-06-12T19:00:00.000Z",location:"Grande salle",status:"planned"}
    ],
    alerts:[{_id:"alert-1",wedding:DEMO_WEDDING_ID,type:"warning",title:"Traiteur à confirmer",message:"Pensez à confirmer le nombre final de menus.",read:false}]
  }));
}
function readStore(){ensureDemoStore();return JSON.parse(localStorage.getItem("weddingPlusDemoStore"));}
function writeStore(store){localStorage.setItem("weddingPlusDemoStore",JSON.stringify(store));}
function demoUser(name="Glorie",email="demo@weddingplus.fr"){
  const store=readStore();
  return {success:true,data:{user:{_id:"demo-user",name,email,role:"user",weddings:store.weddings},token:"demo-token"}};
}
function demoDashboard(weddingId){
  const s=readStore(); const wedding=s.weddings.find(w=>w._id===weddingId)||s.weddings[0];
  const tasks=s.tasks.filter(x=>x.wedding===wedding._id),guests=s.guests.filter(x=>x.wedding===wedding._id),vendors=s.vendors.filter(x=>x.wedding===wedding._id),budget=s.budget.filter(x=>x.wedding===wedding._id),timeline=s.timeline.filter(x=>x.wedding===wedding._id);
  const spent=budget.reduce((a,x)=>a+(Number(x.actual)||0),0),estimated=budget.reduce((a,x)=>a+(Number(x.estimated)||0),0);
  return {success:true,data:{wedding,stats:{tasks:{completed:tasks.filter(x=>x.status==='done').length,total:tasks.length},guests:{confirmed:guests.filter(x=>x.rsvp==='confirmed').length,total:guests.length},vendors:{booked:vendors.filter(x=>['booked','paid'].includes(x.status)).length,total:vendors.length},budget:{spent,estimated,target:wedding.budgetTarget},unreadAlerts:s.alerts.filter(x=>!x.read).length},nextTasks:tasks.filter(x=>x.status!=='done').slice(0,5),timeline:timeline.slice(0,8)}};
}
async function demoApi(path,options={}){
  const method=(options.method||"GET").toUpperCase(); const body=options.body?JSON.parse(options.body):{};
  if(path==="/auth/register") return demoUser(body.name,body.email);
  if(path==="/auth/login") return demoUser("Glorie",body.email||"demo@weddingplus.fr");
  if(path==="/auth/me") return {success:true,data:getCurrentUser()||demoUser().data.user};
  if(path.startsWith("/dashboard/")) return demoDashboard(path.split("/").pop());
  if(path==="/weddings"&&method==="GET") return {success:true,data:readStore().weddings};
  if(path==="/weddings"&&method==="POST") { const s=readStore(); s.weddings[0]={...s.weddings[0],...body}; writeStore(s); return {success:true,data:s.weddings[0]}; }
  const match=path.match(/^\/(tasks|guests|vendors|budget|timeline|alerts)(?:\/([^?]+))?(?:\?.*)?$/);
  if(!match) throw new Error("Fonction indisponible en mode démo");
  const [,resource,id]=match; const store=readStore(); let rows=store[resource]||[];
  if(method==="GET") return {success:true,data:rows};
  if(method==="POST"){const item={_id:uid(resource),...body};rows.unshift(item);store[resource]=rows;writeStore(store);return {success:true,data:item};}
  if(method==="PUT"&&id){const i=rows.findIndex(x=>x._id===id);if(i<0)throw new Error("Ressource introuvable");rows[i]={...rows[i],...body};store[resource]=rows;writeStore(store);return {success:true,data:rows[i]};}
  if(method==="DELETE"&&id){store[resource]=rows.filter(x=>x._id!==id);writeStore(store);return {success:true,message:"Suppression effectuée"};}
  throw new Error("Action indisponible en mode démo");
}

export async function api(path,options={}){
  if(!USE_REAL_API) return demoApi(path,options);
  const token=getToken();
  const response=await fetch(`${API_URL}${path}`,{...options,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{ }),...(options.headers||{})}});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload.message||"Une erreur est survenue");
  return payload;
}

export const authApi={login:(email,password)=>api("/auth/login",{method:"POST",body:JSON.stringify({email,password})}),register:(name,email,password)=>api("/auth/register",{method:"POST",body:JSON.stringify({name,email,password})}),me:()=>api("/auth/me")};
export const weddingApi={dashboard:(weddingId)=>api(`/dashboard/${weddingId}`),list:()=>api("/weddings"),create:(data)=>api("/weddings",{method:"POST",body:JSON.stringify(data)})};
export function crudApi(resource){return{list:(wedding)=>api(`/${resource}${wedding?`?wedding=${wedding}`:""}`),create:(data)=>api(`/${resource}`,{method:"POST",body:JSON.stringify(data)}),update:(id,data)=>api(`/${resource}/${id}`,{method:"PUT",body:JSON.stringify(data)}),remove:(id)=>api(`/${resource}/${id}`,{method:"DELETE"})};}
