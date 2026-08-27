import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Connexion from "./views/Connexion.vue";
import Inscription from "./views/Inscription.vue";
import Dashboard from "./views/Dashboard.vue";
const router=createRouter({history:createWebHistory(),routes:[
{path:"/",component:App},{path:"/connexion",component:Connexion},{path:"/inscription",component:Inscription},{path:"/dashboard",component:Dashboard}
]});
createApp(App).use(router).mount("#app");