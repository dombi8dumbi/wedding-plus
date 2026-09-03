import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Splash from "./views/Splash.vue";
import Connexion from "./views/Connexion.vue";
import Inscription from "./views/Inscription.vue";
import Onboarding from "./views/Onboarding.vue";
import InvitationResponse from "./views/InvitationResponse.vue";
import Dashboard from "./views/Dashboard.vue";
import Mariage from "./views/Mariage.vue";
import Tasks from "./views/Tasks.vue";
import Budget from "./views/Budget.vue";
import Invites from "./views/Invites.vue";
import PlanTable from "./views/PlanTable.vue";
import Prestataires from "./views/Prestataires.vue";
import Alertes from "./views/Alertes.vue";
import IA from "./views/IA.vue";
import Parametres from "./views/Parametres.vue";
import Nav from "./components/Nav.vue";
import "./views/screen.css";

const router=createRouter({history:createWebHistory(),routes:[
{path:"/",component:Splash},{path:"/connexion",component:Connexion},{path:"/inscription",component:Inscription},{path:"/onboarding",component:Onboarding},
{path:"/invitation/:token",component:InvitationResponse},
{path:"/dashboard",component:Dashboard},{path:"/mariage",component:Mariage},{path:"/tasks",component:Tasks},
{path:"/budget",component:Budget},{path:"/invites",component:Invites},{path:"/plan-table",component:PlanTable},
{path:"/prestataires",component:Prestataires},{path:"/alertes",component:Alertes},{path:"/ia",component:IA},
{path:"/parametres",component:Parametres},
{path:"/:pathMatch(.*)*",redirect:"/"}
]});

router.beforeEach((to,from)=>{
  if(to.path.startsWith("/invitation/")) return true;
  if(to.path==="/dashboard" && from.path==="/inscription") return "/onboarding";
  if(to.path!=="/dashboard") return true;
  try{
    const user=JSON.parse(localStorage.getItem("weddingPlusUser")||"null");
    if(user && !(user.weddings||[]).length) return "/onboarding";
  }catch{}
  return true;
});

createApp(App).component("Nav",Nav).use(router).mount("#app");
