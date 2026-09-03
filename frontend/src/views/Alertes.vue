<template>
  <main class="screen alerts-screen">
    <header class="page-header">
      <RouterLink to="/dashboard" class="back">‹</RouterLink>
      <div><small>CENTRE DE SUIVI</small><b>Alertes & rappels</b></div>
      <RouterLink to="/parametres" class="settings-link" aria-label="Paramètres">⚙</RouterLink>
    </header>

    <section class="alerts-hero">
      <div>
        <p class="eyebrow">WEDDING+ VEILLE POUR VOUS</p>
        <h1>Rien ne doit vous échapper.</h1>
        <p>Suivez les échéances, le budget et les confirmations importantes depuis un seul endroit.</p>
      </div>
      <div class="alert-score"><strong>{{ unreadCount }}</strong><span>à consulter</span></div>
    </section>

    <div class="filters">
      <button :class="{active:filter==='all'}" @click="filter='all'">Toutes</button>
      <button :class="{active:filter==='unread'}" @click="filter='unread'">Non lues <span>{{ unreadCount }}</span></button>
      <button :class="{active:filter==='important'}" @click="filter='important'">Importantes</button>
    </div>

    <section class="alerts-list">
      <article v-for="a in visibleAlerts" :key="a._id" class="alert-card" :class="[a.type,{read:a.read}]">
        <div class="alert-icon">{{ iconFor(a.type) }}</div>
        <div class="alert-copy">
          <div class="alert-top">
            <div><span v-if="!a.read" class="dot"></span><strong>{{ a.title }}</strong></div>
            <small>{{ a.when || 'Aujourd’hui' }}</small>
          </div>
          <p>{{ a.message || a.text }}</p>
          <div class="alert-actions">
            <RouterLink v-if="a.link" :to="a.link" class="action-link">{{ a.action || 'Consulter' }} →</RouterLink>
            <button v-if="!a.read" class="read-btn" @click="markRead(a)">Marquer comme lue</button>
          </div>
        </div>
      </article>

      <div v-if="!visibleAlerts.length" class="empty-state">
        <div>✓</div><h3>Tout est à jour</h3><p>Aucune alerte ne correspond à ce filtre.</p>
      </div>
    </section>

    <button v-if="unreadCount" class="mark-all" @click="markAll">Tout marquer comme lu</button>
    <Nav/>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { crudApi, getWeddingId } from '../services/api.js'

const api = crudApi('alerts')
const alerts = ref([])
const filter = ref('all')

const contextual = [
  {_id:'ctx-task',title:'Échéance à surveiller',message:'La confirmation du traiteur approche. Vérifiez cette tâche avant la date limite.',type:'warning',read:false,link:'/tasks',action:'Voir les tâches',when:'Aujourd’hui'},
  {_id:'ctx-budget',title:'Point budget recommandé',message:'Certaines dépenses sont déjà engagées. Consultez le budget avant les prochains paiements.',type:'info',read:false,link:'/budget',action:'Voir le budget',when:'Aujourd’hui'},
  {_id:'ctx-vendor',title:'Prestataire à relancer',message:'DJ Harmony est encore au statut « contacté ». Une confirmation reste attendue.',type:'danger',read:false,link:'/prestataires',action:'Voir les prestataires',when:'À vérifier'}
]

onMounted(async()=>{
  try {
    const r = await api.list(getWeddingId())
    const server = (r.data || []).map(a=>({...a,link:a.link || '/dashboard',action:a.action || 'Consulter',when:a.when || 'Aujourd’hui'}))
    alerts.value = server.length ? [...server,...contextual] : contextual
  } catch { alerts.value = contextual }
})

const unreadCount = computed(()=>alerts.value.filter(a=>!a.read).length)
const visibleAlerts = computed(()=>alerts.value.filter(a=>filter.value==='all' || (filter.value==='unread'&&!a.read) || (filter.value==='important'&&['danger','warning'].includes(a.type))))
function iconFor(type){ return type==='danger'?'!':type==='warning'?'△':'♡' }
async function markRead(a){
  a.read=true
  if(!String(a._id).startsWith('ctx-')) try{ await api.update(a._id,{read:true}) }catch{}
}
async function markAll(){ for(const a of alerts.value.filter(x=>!x.read)) await markRead(a) }
</script>

<style scoped>
.alerts-screen{padding-bottom:118px;max-width:1120px;margin:auto}.page-header{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;padding:8px 0 18px}.page-header>div{text-align:center;display:grid;gap:2px}.page-header small{font-size:10px;letter-spacing:.15em;color:#b98538;font-weight:800}.page-header b{font:700 22px Georgia,serif;color:#2d2327}.back,.settings-link{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;text-decoration:none;color:#c91f60;background:#fff;border:1px solid #f0e0e5;font-size:24px}.settings-link{font-size:16px}.alerts-hero{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:28px;border-radius:28px;background:linear-gradient(135deg,#fff0f5,#fffaf0);border:1px solid #f0dce3}.eyebrow{margin:0 0 7px!important;font-size:10px!important;letter-spacing:.14em;color:#b98538!important;font-weight:800}.alerts-hero h1{margin:0 0 8px;font:700 30px Georgia,serif;color:#c91f60}.alerts-hero p{margin:0;max-width:650px;color:#74676c;font-size:13px;line-height:1.6}.alert-score{min-width:112px;height:112px;border-radius:50%;background:#fff;display:grid;place-content:center;text-align:center;box-shadow:0 12px 30px rgba(115,65,83,.08)}.alert-score strong{font:700 33px Georgia,serif;color:#c91f60}.alert-score span{font-size:10px;color:#8a7d82}.filters{display:flex;gap:8px;margin:18px 0}.filters button{border:1px solid #eadde1;background:#fff;color:#766970;border-radius:999px;padding:9px 14px;font-size:11px}.filters button.active{background:#c91f60;color:#fff;border-color:#c91f60}.filters span{display:inline-grid;place-items:center;min-width:17px;height:17px;margin-left:4px;border-radius:9px;background:rgba(255,255,255,.25)}.alerts-list{display:grid;gap:10px}.alert-card{display:grid;grid-template-columns:48px 1fr;gap:14px;padding:17px 18px;border-radius:20px;background:#fff;border:1px solid #eee1e5;box-shadow:0 8px 22px rgba(95,52,69,.04)}.alert-card.read{opacity:.65}.alert-card.warning{border-left:4px solid #d6a24c}.alert-card.danger{border-left:4px solid #c91f60}.alert-card.info{border-left:4px solid #b68c9c}.alert-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:#fff2f6;color:#c91f60;font-weight:900;font-size:18px}.warning .alert-icon{background:#fff7e9;color:#b37b26}.alert-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.alert-top>div{display:flex;align-items:center;gap:7px}.alert-top strong{font-size:13px;color:#352a2e}.alert-top small{font-size:9px;color:#9c8f94}.dot{width:7px;height:7px;border-radius:50%;background:#c91f60}.alert-copy p{margin:7px 0 12px;font-size:11px;color:#796d72;line-height:1.55}.alert-actions{display:flex;align-items:center;gap:14px}.action-link{font-size:10px;color:#c91f60;font-weight:800;text-decoration:none}.read-btn{padding:0!important;min-height:0!important;background:none!important;border:0!important;color:#9a8b91!important;font-size:9px!important;box-shadow:none!important}.mark-all{display:block;margin:16px auto 0!important;width:auto!important;padding:10px 18px!important;border-radius:999px!important;background:#fff!important;color:#c91f60!important;border:1px solid #eacfd8!important;font-size:10px!important}.empty-state{text-align:center;padding:48px 20px;border:1px dashed #e8d8de;border-radius:22px}.empty-state div{font-size:26px;color:#b98538}.empty-state h3{font:700 18px Georgia,serif;margin:8px 0 4px}.empty-state p{font-size:11px;color:#8e8186}@media(max-width:620px){.alerts-hero{padding:20px}.alert-score{display:none}.alerts-hero h1{font-size:24px}.alert-card{grid-template-columns:38px 1fr;padding:14px}.alert-icon{width:36px;height:36px}.alert-top{align-items:flex-start}.filters{overflow:auto}.page-header b{font-size:19px}}
</style>