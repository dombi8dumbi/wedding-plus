const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const envFlag = import.meta.env.VITE_USE_REAL_API;
const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const USE_REAL_API = envFlag === "true" || (envFlag !== "false" && isLocalhost);

function uid(prefix){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`}
function getToken(){return localStorage.getItem("weddingPlusToken")}
export function getCurrentUser(){try{return JSON.parse(localStorage.getItem("weddingPlusUser")||"null")}catch{return null}}
export function getWeddingId(){const u=getCurrentUser();const w=u?.weddings?.[0];return (typeof w==="string"?w:w?._id)||u?.weddingId||null}
export function setSession({token,user}){if(token)localStorage.setItem("weddingPlusToken",token);if(user)localStorage.setItem("weddingPlusUser",JSON.stringify(user))}
export function updateCurrentUser(user){localStorage.setItem("weddingPlusUser",JSON.stringify(user));if(!USE_REAL_API)saveAccount(user)}
export function clearSession(){localStorage.removeItem("weddingPlusToken");localStorage.removeItem("weddingPlusUser")}

function readStore(){try{return JSON.parse(localStorage.getItem("weddingPlusDemoStore")||"null")||{weddings:[],tasks:[],guests:[],vendors:[],budget:[],timeline:[],alerts:[]}}catch{return {weddings:[],tasks:[],guests:[],vendors:[],budget:[],timeline:[],alerts:[]}}}
function writeStore(s){localStorage.setItem("weddingPlusDemoStore",JSON.stringify(s))}
function readAccounts(){try{return JSON.parse(localStorage.getItem("weddingPlusDemoAccounts")||"[]")}catch{return []}}
function saveAccount(user){if(!user?.email)return;const a=readAccounts();const i=a.findIndex(x=>x.email?.toLowerCase()===user.email.toLowerCase());if(i>=0)a[i]=user;else a.push(user);localStorage.setItem("weddingPlusDemoAccounts",JSON.stringify(a))}
function findAccount(email){return readAccounts().find(x=>x.email?.toLowerCase()===String(email||"").toLowerCase())}

function dashboard(weddingId){const s=readStore();const wedding=s.weddings.find(w=>w._id===weddingId);if(!wedding)throw new Error("Mariage introuvable");const f=n=>(s[n]||[]).filter(x=>x.wedding===weddingId);const tasks=f("tasks"),guests=f("guests"),vendors=f("vendors"),budget=f("budget"),timeline=f("timeline"),alerts=f("alerts");const spent=budget.reduce((a,x)=>a+(Number(x.actual)||0),0),estimated=budget.reduce((a,x)=>a+(Number(x.estimated)||0),0);return {success:true,data:{wedding,stats:{tasks:{completed:tasks.filter(x=>x.status==='done').length,total:tasks.length},guests:{confirmed:guests.filter(x=>x.rsvp==='confirmed').length,total:guests.length},vendors:{booked:vendors.filter(x=>['booked','paid'].includes(x.status)).length,total:vendors.length},budget:{spent,estimated,target:Number(wedding.budgetTarget)||0},unreadAlerts:alerts.filter(x=>!x.read).length},nextTasks:tasks.filter(x=>x.status!=='done').slice(0,5),timeline:timeline.slice(0,8)}}}

function onboarding(body){const user=getCurrentUser();if(!user)throw new Error("Veuillez vous reconnecter.");const s=readStore(),id=uid("wedding");const date=body.date||"";const wedding={_id:id,owner:user._id,title:"Notre mariage",partner1:body.partner1||user.name?.split(" ")[0]||"",partner2:body.partner2||"",date:date?new Date(`${date}T14:00:00`).toISOString():"",location:body.location||"",budgetTarget:Number(body.budgetTarget)||0,guestTarget:Number(body.guestTarget)||0,style:body.style||"",priorities:body.priorities||[],status:"planning"};s.weddings.push(wedding);[
"Définir les grandes étapes du planning","Établir une première liste d’invités","Rechercher les prestataires prioritaires"
].forEach((title,i)=>s.tasks.push({_id:uid("task"),wedding:id,title,status:"todo",priority:i===0?"high":"medium",suggested:true}));if(date)s.timeline.push({_id:uid("timeline"),wedding:id,title:"Cérémonie",startTime:new Date(`${date}T14:00:00`).toISOString(),location:body.location||"",status:"planned",suggested:true});s.alerts.push({_id:uid("alert"),wedding:id,type:"info",title:"Votre espace est prêt",message:"Wedding+ a préparé quelques suggestions de départ.",read:false});writeStore(s);const updated={...user,weddingId:id,weddings:[wedding]};updateCurrentUser(updated);return {success:true,data:{wedding,user:updated,suggestions:{tasks:3,budget:0,timeline:date?1:0}}}}

async function demoApi(path,options={}){const method=(options.method||"GET").toUpperCase();const body=options.body?JSON.parse(options.body):{};
if(path==="/auth/register"){if(findAccount(body.email))throw new Error("Un compte existe déjà avec cette adresse e-mail.");const user={_id:uid("user"),name:body.name,email:body.email,role:"user",weddings:[],weddingId:null};saveAccount(user);return {success:true,data:{user,token:`demo-${user._id}`,needsOnboarding:true}}}
if(path==="/auth/login"){const user=findAccount(body.email);if(!user)throw new Error("Compte introuvable.");return {success:true,data:{user,token:`demo-${user._id}`,needsOnboarding:!getWeddingFromUser(user)}}}
if(path==="/auth/me")return {success:true,data:getCurrentUser()};
if(path==="/onboarding"&&method==="POST")return onboarding(body);
if(path.startsWith("/dashboard/"))return dashboard(path.split("/").pop());
if(path.startsWith("/weddings")&&method==="GET"){const id=getWeddingId();return {success:true,data:id?readStore().weddings.filter(w=>w._id===id):[]}}
if(path==="/weddings"&&method==="POST"){const s=readStore(),id=getWeddingId(),i=s.weddings.findIndex(w=>w._id===id);if(i<0)throw new Error("Mariage introuvable");s.weddings[i]={...s.weddings[i],...body,_id:id};writeStore(s);return {success:true,data:s.weddings[i]}}
const m=path.match(/^\/(tasks|guests|vendors|budget|timeline|alerts)(?:\/([^?]+))?(?:\?.*)?$/);if(!m)throw new Error("Fonction indisponible en mode démo");const [,resource,id]=m,s=readStore();let rows=s[resource]||[];const wedding=new URLSearchParams(path.split('?')[1]||'').get('wedding');if(method==="GET")return {success:true,data:wedding?rows.filter(x=>x.wedding===wedding):rows};if(method==="POST"){const item={_id:uid(resource),...body};rows.unshift(item);s[resource]=rows;writeStore(s);return {success:true,data:item}}if(method==="PUT"&&id){const i=rows.findIndex(x=>x._id===id);if(i<0)throw new Error("Ressource introuvable");rows[i]={...rows[i],...body};s[resource]=rows;writeStore(s);return {success:true,data:rows[i]}}if(method==="DELETE"&&id){s[resource]=rows.filter(x=>x._id!==id);writeStore(s);return {success:true,message:"Suppression effectuée"}}throw new Error("Action indisponible")}
function getWeddingFromUser(u){const w=u?.weddings?.[0];return (typeof w==="string"?w:w?._id)||u?.weddingId||null}

export async function api(path,options={}){if(!USE_REAL_API)return demoApi(path,options);const token=getToken();const r=await fetch(`${API_URL}${path}`,{...options,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{ }),...(options.headers||{})}});const p=await r.json().catch(()=>({}));if(!r.ok)throw new Error(p.message||"Une erreur est survenue");return p}
export const authApi={login:(email,password)=>api("/auth/login",{method:"POST",body:JSON.stringify({email,password})}),register:(name,email,password)=>api("/auth/register",{method:"POST",body:JSON.stringify({name,email,password})}),me:()=>api("/auth/me")};
export const onboardingApi={create:data=>api("/onboarding",{method:"POST",body:JSON.stringify(data)})};
export const weddingApi={dashboard:id=>api(`/dashboard/${id}`),list:(id=getWeddingId())=>api(`/weddings${id?`?wedding=${id}`:""}`),create:data=>api("/weddings",{method:"POST",body:JSON.stringify(data)})};
export function crudApi(resource){return {list:wedding=>api(`/${resource}${wedding?`?wedding=${wedding}`:""}`),create:data=>api(`/${resource}`,{method:"POST",body:JSON.stringify(data)}),update:(id,data)=>api(`/${resource}/${id}`,{method:"PUT",body:JSON.stringify(data)}),remove:id=>api(`/${resource}/${id}`,{method:"DELETE"})}}
