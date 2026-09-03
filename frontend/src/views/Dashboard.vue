<template>
  <main class="screen dashboard">
    <header class="topbar">
      <div class="brand-block"><div class="brand-mark">W<span>+</span></div><div><p class="eyebrow">WEDDING+</p><h1>Bonjour {{ firstName }} 👋🏾</h1></div></div>
      <div class="top-actions"><RouterLink to="/alertes" class="icon-btn">♡</RouterLink><RouterLink to="/parametres" class="avatar" :title="fullName">{{ avatarInitial }}</RouterLink></div>
    </header>

    <section class="hero-grid">
      <article class="countdown-card">
        <div><span class="tag">Votre mariage</span><h2>J-{{ daysLeft }}</h2><p>{{ formattedDate }}</p><div class="place">{{ data.wedding?.location || 'Lieu à confirmer' }}</div></div>
        <div class="rings"><span class="ring one"></span><span class="ring two"></span><i>✦</i></div>
      </article>
      <article class="progress-card">
        <div class="card-heading"><div><span class="tag muted-tag">Préparation</span><h3>Progression globale</h3></div><strong>{{ progress }}%</strong></div>
        <div class="progress"><span :style="{width:progress+'%'}" /></div>
        <p>{{ remainingTasks }} tâche(s) restent à finaliser avant le grand jour.</p>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel tasks-panel">
        <div class="section-title"><div><span class="tag muted-tag">À faire</span><h3>Prochaines tâches</h3></div><RouterLink to="/tasks">Voir tout</RouterLink></div>
        <div class="task-list">
          <div v-for="t in data.nextTasks || []" :key="t._id" class="task"><span class="task-dot" :class="t.priority"></span><div><strong>{{ t.title }}</strong><small>{{ formatTaskDate(t.dueDate) }}</small></div><span class="status">{{ t.status==='in-progress'?'En cours':'À faire' }}</span></div>
          <div v-if="!(data.nextTasks||[]).length" class="empty">Toutes les tâches sont terminées ✦</div>
        </div>
      </article>
      <aside class="stats-column">
        <RouterLink to="/budget" class="mini-card"><div class="mini-icon">€</div><div><span>Budget dépensé</span><strong>{{ spent.toLocaleString('fr-FR') }} €</strong><small>sur {{ target.toLocaleString('fr-FR') }} €</small></div><b>{{ budgetPercent }}%</b></RouterLink>
        <RouterLink to="/invites" class="mini-card"><div class="mini-icon people">♡</div><div><span>Invités confirmés</span><strong>{{ guestsConfirmed }}</strong><small>sur {{ guestsTotal }} invités</small></div><b>{{ guestPercent }}%</b></RouterLink>
        <RouterLink to="/prestataires" class="mini-card"><div class="mini-icon gold-icon">✓</div><div><span>Prestataires</span><strong>{{ vendorsBooked }} / {{ vendorsTotal }}</strong><small>réservés ou payés</small></div><b>{{ vendorPercent }}%</b></RouterLink>
      </aside>
    </section>

    <section class="quick-actions">
      <RouterLink to="/invites"><span>＋</span><div><strong>Ajouter un invité</strong><small>Gérer les confirmations</small></div></RouterLink>
      <RouterLink to="/budget"><span>€</span><div><strong>Ajouter une dépense</strong><small>Suivre le budget</small></div></RouterLink>
      <RouterLink to="/prestataires"><span>☆</span><div><strong>Prestataires</strong><small>Gérer les réservations</small></div></RouterLink>
      <RouterLink to="/mariage"><span>✦</span><div><strong>Mode Jour J</strong><small>Voir le déroulé</small></div></RouterLink>
    </section>
    <Nav/>
  </main>
</template>

<script setup>
import { computed,onMounted,reactive,ref } from 'vue'
import { authApi,getCurrentUser,getWeddingId,weddingApi } from '../services/api'
const data=reactive({wedding:null,stats:{},nextTasks:[]})
const user=ref(getCurrentUser())
const fullName=computed(()=>String(user.value?.name||'').trim())
const firstName=computed(()=>fullName.value.split(/\s+/)[0]||'Bienvenue')
const avatarInitial=computed(()=>firstName.value==='Bienvenue'?'?':firstName.value.charAt(0).toUpperCase())
const daysLeft=computed(()=>data.wedding?.date?Math.max(0,Math.ceil((new Date(data.wedding.date)-new Date())/86400000)):0)
const formattedDate=computed(()=>data.wedding?.date?new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(data.wedding.date)):'Date à confirmer')
const tasksTotal=computed(()=>data.stats?.tasks?.total||0),tasksDone=computed(()=>data.stats?.tasks?.completed||0),remainingTasks=computed(()=>Math.max(0,tasksTotal.value-tasksDone.value))
const progress=computed(()=>tasksTotal.value?Math.round(tasksDone.value/tasksTotal.value*100):0)
const spent=computed(()=>data.stats?.budget?.spent||0),target=computed(()=>data.stats?.budget?.target||0),budgetPercent=computed(()=>target.value?Math.min(100,Math.round(spent.value/target.value*100)):0)
const guestsConfirmed=computed(()=>data.stats?.guests?.confirmed||0),guestsTotal=computed(()=>data.stats?.guests?.total||0),guestPercent=computed(()=>guestsTotal.value?Math.round(guestsConfirmed.value/guestsTotal.value*100):0)
const vendorsBooked=computed(()=>data.stats?.vendors?.booked||0),vendorsTotal=computed(()=>data.stats?.vendors?.total||0),vendorPercent=computed(()=>vendorsTotal.value?Math.round(vendorsBooked.value/vendorsTotal.value*100):0)
function formatTaskDate(v){return v?new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long'}).format(new Date(v)):'Sans échéance'}
onMounted(async()=>{
  try{const me=await authApi.me();user.value=me.data||getCurrentUser()}catch{user.value=getCurrentUser()}
  Object.assign(data,(await weddingApi.dashboard(getWeddingId())).data)
})
</script>

<style scoped>
.dashboard{background:linear-gradient(180deg,#fff 0%,#fffafc 100%);padding-bottom:105px}.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.brand-block,.top-actions{display:flex;align-items:center}.brand-block{gap:14px}.brand-mark{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;font-family:Georgia,serif;font-size:28px;font-style:italic;color:#d82d6d;background:linear-gradient(145deg,#fff1f6,#fffaf2);border:1px solid #f3d8df}.brand-mark span{color:#c48a39;font-style:normal;font-size:17px}.eyebrow{margin:0 0 2px;font-size:11px;letter-spacing:.18em;color:#c48a39;font-weight:800}.topbar h1{margin:0;font-size:22px}.top-actions{gap:10px}.icon-btn{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#fff;text-decoration:none;color:#c91f60;border:1px solid #f1dce3}.avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#e55286,#bf1f5b);font-weight:800;text-decoration:none}.hero-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:18px}.countdown-card,.progress-card,.panel,.mini-card,.quick-actions a{border:1px solid #f0dfe5;box-shadow:0 10px 30px rgba(108,55,73,.06)}.countdown-card{min-height:220px;border-radius:26px;padding:30px;background:linear-gradient(130deg,#fff5f7 0%,#fff 54%,#fff5e8 100%);display:flex;justify-content:space-between;align-items:center;overflow:hidden;position:relative}.countdown-card h2{font-family:Georgia,serif;font-size:68px;line-height:1;margin:10px 0 6px;color:#c91f60;font-weight:500}.countdown-card p{font-size:18px;margin:0 0 8px;font-weight:700}.place{font-size:13px;color:#8c7e84}.tag{display:inline-flex;padding:7px 11px;border-radius:999px;background:#fff;border:1px solid #f0d9df;color:#c91f60;font-size:11px;font-weight:800}.muted-tag{background:#fff9fb;color:#9a7582}.rings{position:relative;width:190px;height:150px}.ring{position:absolute;width:92px;height:92px;border:7px solid #c58a35;border-radius:50%;top:32px}.ring.one{left:20px}.ring.two{left:80px;top:44px}.rings i{position:absolute;right:18px;top:4px;color:#e9b858;font-size:32px}.progress-card{border-radius:26px;padding:28px;background:#fff}.card-heading{display:flex;justify-content:space-between;gap:20px}.card-heading h3,.section-title h3{margin:10px 0 0;font-size:18px}.card-heading strong{font-family:Georgia,serif;font-size:38px;color:#c91f60}.progress{height:12px;background:#f4e9ed;border-radius:999px;margin:28px 0 14px;overflow:hidden}.progress span{display:block;height:100%;background:linear-gradient(90deg,#e84d83,#c91f60)}.progress-card p{color:#8c7e84;font-size:13px}.content-grid{display:grid;grid-template-columns:1.55fr .85fr;gap:18px;margin-top:18px}.panel{border-radius:26px;background:#fff;padding:24px}.section-title{display:flex;justify-content:space-between;margin-bottom:12px}.section-title a{color:#c91f60;text-decoration:none;font-size:13px;font-weight:700}.task{display:grid;grid-template-columns:14px 1fr auto;align-items:center;gap:12px;padding:15px 2px;border-bottom:1px solid #f4eaed}.task-dot{width:11px;height:11px;border-radius:50%;background:#c58a35}.task-dot.high{background:#c91f60}.task div{display:grid;gap:4px}.task small{color:#8c7e84;font-size:12px}.status{font-size:11px;color:#9c6275;background:#fff1f5;padding:6px 9px;border-radius:999px}.empty{padding:25px;color:#8c7e84}.stats-column{display:grid;gap:12px}.mini-card{min-height:94px;border-radius:22px;background:#fff;padding:17px;display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:13px;text-decoration:none;color:inherit}.mini-icon{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:#fff0f5;color:#c91f60;font-size:20px;font-weight:800}.mini-icon.gold-icon{background:#fff6e9;color:#b87925}.mini-card div:nth-child(2){display:grid;gap:2px}.mini-card span,.mini-card small{font-size:11px;color:#8c7e84}.mini-card strong{font-size:18px}.mini-card b{font-size:13px;color:#c91f60}.quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}.quick-actions a{min-height:88px;border-radius:20px;background:#fff;text-decoration:none;color:#2b2226;padding:15px;display:flex;align-items:center;gap:12px}.quick-actions a>span{width:38px;height:38px;border-radius:13px;background:#fff1f5;color:#c91f60;display:grid;place-items:center;font-weight:800;font-size:18px}.quick-actions div{display:grid;gap:3px}.quick-actions strong{font-size:13px}.quick-actions small{font-size:10px;color:#8c7e84}@media(max-width:900px){.hero-grid,.content-grid{grid-template-columns:1fr}.quick-actions{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.countdown-card{min-height:170px;padding:20px}.countdown-card h2{font-size:48px}.rings{position:absolute;right:-30px;opacity:.35}.quick-actions{grid-template-columns:1fr 1fr}.topbar h1{font-size:18px}.task{grid-template-columns:12px 1fr}.status{display:none}}
</style>