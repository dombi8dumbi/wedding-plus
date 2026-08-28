import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Connexion from "./views/Connexion.vue";
import Inscription from "./views/Inscription.vue";
import Dashboard from "./views/Dashboard.vue";
import Mariage from "./views/Mariage.vue";
import Tasks from "./views/Tasks.vue";
import Budget from "./views/Budget.vue";
import Invites from "./views/Invites.vue";
import PlanTable from "./views/PlanTable.vue";
import Prestataires from "./views/Prestataires.vue";
import Alertes from "./views/Alertes.vue";
import IA from "./views/IA.vue";
import Nav from "./components/Nav.vue";
import "./views/screen.css";

const router=createRouter({history:createWebHistory(),routes:[
{path:"/",component:App},{path:"/connexion",component:Connexion},{path:"/inscription",component:Inscription},
{path:"/dashboard",component:Dashboard},{path:"/mariage",component:Mariage},{path:"/tasks",component:Tasks},
{path:"/budget",component:Budget},{path:"/invites",component:Invites},{path:"/plan-table",component:PlanTable},
{path:"/prestataires",component:Prestataires},{path:"/alertes",component:Alertes},{path:"/ia",component:IA}
]});
createApp(App).component("Nav",Nav).use(router).mount("#app");