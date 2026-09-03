const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5000/api" : "/api");
const envFlag = import.meta.env.VITE_USE_REAL_API;
const USE_REAL_API = envFlag !== "false";

function uid(prefix){ return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}` }
function getToken(){ return localStorage.getItem("weddingPlusToken") }
export function getCurrentUser(){ try{return JSON.parse(localStorage.getItem("weddingPlusUser")||"null")}catch{return null} }
export function getWeddingId(){ const u=getCurrentUser();const w=u?.weddings?.[0];return (typeof w==="string"?w:w?._id)||u?.weddingId||null }
export function setSession({token,user}){ if(token)localStorage.setItem("weddingPlusToken",token);if(user)localStorage.setItem("weddingPlusUser",JSON.stringify(user)) }
export function updateCurrentUser(user){ localStorage.setItem("weddingPlusUser",JSON.stringify(user));if(!USE_REAL_API)saveAccount(user) }
export function clearSession(){ localStorage.removeItem("weddingPlusToken");localStorage.removeItem("weddingPlusUser") }

const EMPTY_STORE={weddings:[],tasks:[],guests:[],vendors:[],budget:[],timeline:[],alerts:[]};
function readStore(){ try{return JSON.parse(localStorage.getItem("weddingPlusDemoStore")||"null")||structuredClone(EMPTY_STORE)}catch{return structuredClone(EMPTY_STORE)} }
function writeStore(s){ localStorage.setItem("weddingPlusDemoStore",JSON.stringify(s)) }
function readAccounts(){ try{return JSON.parse(localStorage.getItem("weddingPlusDemoAccounts")||"[]")}catch{return []} }
function saveAccount(user){ if(!user?.email)return;const a=readAccounts();const i=a.findIndex(x=>x.email?.toLowerCase()===user.email.toLowerCase());if(i>=0)a[i]=user;else a.push(user);localStorage.setItem("weddingPlusDemoAccounts",JSON.stringify(a)) }
function findAccount(email){ return readAccounts().find(x=>x.email?.toLowerCase()===String(email||"").toLowerCase()) }
function getWeddingFromUser(u){ const w=u?.weddings?.[0];return (typeof w==="string"?w:w?._id)||u?.weddingId||null }

const STYLE_SUGGESTIONS={
  "Traditionnel":{
    tasks:["Lister les traditions à intégrer à la cérémonie","Identifier les tenues traditionnelles et leurs accessoires","Prévoir l’accueil et la place des aînés","Valider le menu traditionnel avec le traiteur","Organiser les temps forts culturels et musicaux","Préparer les cadeaux ou symboles destinés aux familles"],
    budget:["Tenues traditionnelles","Cérémonie & coutumes","Traiteur traditionnel","Musique & animation","Décoration culturelle","Cadeaux aux familles"],
    timeline:["Accueil des familles","Cérémonie traditionnelle","Photos avec les familles","Réception & repas","Danses et animations"]
  },
  "Élégant":{
    tasks:["Définir une palette de couleurs raffinée","Sélectionner le lieu de réception","Comparer les traiteurs prioritaires","Préparer la liste d’invités","Choisir photographe et vidéaste","Créer le déroulé du Jour J"],
    budget:["Lieu","Traiteur","Photo & vidéo","Décoration florale","Tenues","Musique"],
    timeline:["Préparatifs","Cérémonie","Cocktail","Dîner","Soirée"]
  },
  "Romantique":{
    tasks:["Créer une ambiance florale et lumineuse","Choisir les musiques de cérémonie","Préparer les vœux et moments symboliques","Sélectionner photographe et vidéaste","Imaginer les cadeaux invités","Organiser le dîner et l’ouverture de bal"],
    budget:["Fleurs","Lumières & bougies","Photo & vidéo","Musique","Papeterie","Réception"],
    timeline:["Préparatifs","Cérémonie","Séance couple","Dîner","Ouverture de bal"]
  },
  "Moderne":{
    tasks:["Définir une identité visuelle contemporaine","Créer les invitations digitales","Sélectionner un lieu moderne","Prévoir une expérience invités interactive","Choisir DJ et scénographie lumière","Construire un planning fluide"],
    budget:["Lieu","Scénographie","Digital & papeterie","DJ","Traiteur","Photo & vidéo"],
    timeline:["Préparatifs","Cérémonie","Cocktail","Expérience invités","Soirée"]
  },
  "Chic & minimaliste":{
    tasks:["Limiter la palette à 2 ou 3 couleurs","Choisir une décoration épurée","Prioriser les prestataires essentiels","Simplifier la papeterie","Préparer un plan de table lisible","Créer un déroulé sans temps morts"],
    budget:["Lieu","Traiteur","Décoration minimaliste","Photo","Tenues","Musique"],
    timeline:["Préparatifs","Cérémonie","Cocktail","Dîner","Soirée"]
  },
  "Champêtre":{
    tasks:["Trouver un domaine ou lieu extérieur","Prévoir un plan B météo","Choisir fleurs de saison et éléments naturels","Organiser un repas convivial","Préparer signalétique et éclairage extérieur","Planifier les animations en plein air"],
    budget:["Domaine","Traiteur","Fleurs de saison","Mobilier","Éclairage","Animations"],
    timeline:["Installation","Cérémonie extérieure","Cocktail jardin","Repas","Soirée"]
  },
  "Glamour":{
    tasks:["Définir une scénographie spectaculaire","Choisir les tenues et accessoires","Réserver photo et vidéo premium","Prévoir éclairage et mise en scène","Sélectionner animation musicale","Organiser une entrée des mariés marquante"],
    budget:["Scénographie","Tenues","Photo & vidéo","Lieu","Traiteur","Entertainment"],
    timeline:["Préparatifs","Entrée & cérémonie","Cocktail","Dîner","Show & soirée"]
  }
};
function suggestionFor(style){ return STYLE_SUGGESTIONS[style]||STYLE_SUGGESTIONS["Élégant"] }

function dashboard(weddingId){
  const s=readStore();const wedding=s.weddings.find(w=>w._id===weddingId);if(!wedding)throw new Error("Mariage introuvable");
  const f=n=>(s[n]||[]).filter(x=>x.wedding===weddingId);const tasks=f("tasks"),guests=f("guests"),vendors=f("vendors"),budget=f("budget"),timeline=f("timeline"),alerts=f("alerts");
  const spent=budget.reduce((a,x)=>a+(Number(x.actual)||0),0),estimated=budget.reduce((a,x)=>a+(Number(x.estimated)||0),0);
  return {success:true,data:{wedding,stats:{tasks:{completed:tasks.filter(x=>x.status==='done').length,total:tasks.length},guests:{confirmed:guests.filter(x=>x.rsvp==='confirmed').length,total:guests.length},vendors:{booked:vendors.filter(x=>['booked','paid'].includes(x.status)).length,total:vendors.length},budget:{spent,estimated,target:Number(wedding.budgetTarget)||0},unreadAlerts:alerts.filter(x=>!x.read).length},nextTasks:tasks.filter(x=>x.status!=='done').slice(0,5),timeline:timeline.slice(0,8)}};
}

function onboarding(body){
  const user=getCurrentUser();if(!user)throw new Error("Veuillez vous reconnecter.");
  const s=readStore(),id=uid("wedding"),date=body.date||"";
  const wedding={_id:id,owner:user._id,title:"Notre mariage",partner1:body.partner1||user.name?.split(" ")[0]||"",partner2:body.partner2||"",date:date?new Date(`${date}T14:00:00`).toISOString():"",location:body.location||"",budgetTarget:Number(body.budgetTarget)||0,guestTarget:Number(body.guestTarget)||0,style:body.style||"",priorities:body.priorities||[],status:"planning"};
  s.weddings.push(wedding);
  const suggestions=suggestionFor(wedding.style);
  suggestions.tasks.forEach((title,i)=>s.tasks.push({_id:uid("task"),wedding:id,title,status:"todo",priority:i<2?"high":"medium",suggested:true,suggestionStyle:wedding.style}));
  const weights=[.28,.25,.15,.12,.10,.10];
  suggestions.budget.forEach((label,i)=>s.budget.push({_id:uid("budget"),wedding:id,label,category:label,estimated:Math.round((wedding.budgetTarget||0)*weights[i]),actual:0,paid:false,suggested:true,suggestionStyle:wedding.style}));
  if(date){
    const times=["08:00:00","14:00:00","16:00:00","19:00:00","22:00:00"];
    suggestions.timeline.forEach((title,i)=>s.timeline.push({_id:uid("timeline"),wedding:id,title,startTime:new Date(`${date}T${times[i]||"18:00:00"}`).toISOString(),location:body.location||"",status:"planned",suggested:true,suggestionStyle:wedding.style}));
  }
  s.alerts.push({_id:uid("alert"),wedding:id,type:"info",title:`Suggestions ${wedding.style||'personnalisées'} prêtes`,message:`Wedding+ a adapté vos premières tâches, votre budget et votre planning au style ${wedding.style||'choisi'}.`,read:false});
  writeStore(s);
  const updated={...user,weddingId:id,weddings:[wedding]};updateCurrentUser(updated);
  return {success:true,data:{wedding,user:updated,suggestions:{tasks:suggestions.tasks.length,budget:suggestions.budget.length,timeline:date?suggestions.timeline.length:0}}};
}

async function demoApi(path,options={}){
  const method=(options.method||"GET").toUpperCase();const body=options.body?JSON.parse(options.body):{};
  if(path==="/auth/register"){
    if(findAccount(body.email))throw new Error("Un compte existe déjà avec cette adresse e-mail.");
    const user={_id:uid("user"),name:body.name,email:body.email,role:"user",weddings:[],weddingId:null};saveAccount(user);
    return {success:true,data:{user,token:`demo-${user._id}`,needsOnboarding:true}};
  }
  if(path==="/auth/login"){
    const user=findAccount(body.email);if(!user)throw new Error("Compte introuvable.");
    return {success:true,data:{user,token:`demo-${user._id}`,needsOnboarding:!getWeddingFromUser(user)}};
  }
  if(path==="/auth/me")return {success:true,data:getCurrentUser()};
  if(path==="/onboarding"&&method==="POST")return onboarding(body);
  if(path.startsWith("/dashboard/"))return dashboard(path.split("/").pop());
  if(path.startsWith("/weddings")&&method==="GET"){const id=getWeddingId();return {success:true,data:id?readStore().weddings.filter(w=>w._id===id):[]}}
  if(path==="/weddings"&&method==="POST"){
    const s=readStore(),id=getWeddingId(),i=s.weddings.findIndex(w=>w._id===id);if(i<0)throw new Error("Mariage introuvable");s.weddings[i]={...s.weddings[i],...body,_id:id};writeStore(s);return {success:true,data:s.weddings[i]};
  }
  const m=path.match(/^\/(tasks|guests|vendors|budget|timeline|alerts)(?:\/([^?]+))?(?:\?.*)?$/);if(!m)throw new Error("Fonction indisponible en mode démo");
  const [,resource,id]=m,s=readStore();let rows=s[resource]||[];const wedding=new URLSearchParams(path.split('?')[1]||'').get('wedding');
  if(method==="GET")return {success:true,data:wedding?rows.filter(x=>x.wedding===wedding):rows};
  if(method==="POST"){const item={_id:uid(resource),...body};rows.unshift(item);s[resource]=rows;writeStore(s);return {success:true,data:item}}
  if(method==="PUT"&&id){const i=rows.findIndex(x=>x._id===id);if(i<0)throw new Error("Ressource introuvable");rows[i]={...rows[i],...body};s[resource]=rows;writeStore(s);return {success:true,data:rows[i]}}
  if(method==="DELETE"&&id){s[resource]=rows.filter(x=>x._id!==id);writeStore(s);return {success:true,message:"Suppression effectuée"}}
  throw new Error("Action indisponible");
}

export async function api(path,options={}){
  if(!USE_REAL_API)return demoApi(path,options);
  const token=getToken();const r=await fetch(`${API_URL}${path}`,{...options,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{ }),...(options.headers||{})}});const p=await r.json().catch(()=>({}));if(!r.ok)throw new Error(p.message||"Une erreur est survenue");return p;
}
export const authApi={login:(email,password)=>api("/auth/login",{method:"POST",body:JSON.stringify({email,password})}),register:(name,email,password)=>api("/auth/register",{method:"POST",body:JSON.stringify({name,email,password})}),me:()=>api("/auth/me")};
export const onboardingApi={create:data=>api("/onboarding",{method:"POST",body:JSON.stringify(data)})};
export const weddingApi={dashboard:id=>api(`/dashboard/${id}`),list:(id=getWeddingId())=>api(`/weddings${id?`?wedding=${id}`:""}`),create:data=>api("/weddings",{method:"POST",body:JSON.stringify(data)})};
export const invitationApi={
  send:guestId=>api(`/invitations/${guestId}/send`,{method:"POST"}),
  get:token=>api(`/invitations/respond/${token}`),
  respond:(token,status,reason="")=>api(`/invitations/respond/${token}`,{method:"POST",body:JSON.stringify({status,reason})}),
  runReminders:()=>api("/invitations/reminders/run",{method:"POST"})
};
export function crudApi(resource){return {list:wedding=>api(`/${resource}${wedding?`?wedding=${wedding}`:""}`),create:data=>api(`/${resource}`,{method:"POST",body:JSON.stringify(data)}),update:(id,data)=>api(`/${resource}/${id}`,{method:"PUT",body:JSON.stringify(data)}),remove:id=>api(`/${resource}/${id}`,{method:"DELETE"})}}
