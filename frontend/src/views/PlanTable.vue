<template>
  <main class="screen table-page">
    <header class="page-head">
      <RouterLink to="/invites" class="back">‹</RouterLink>
      <div><span class="eyebrow">WEDDING+</span><h1>Plan de table</h1><p>Placez vos invités et gardez une vue claire de la réception.</p></div>
    </header>

    <section class="summary-card">
      <div><span>Style du mariage</span><strong>{{ wedding?.style || 'Personnalisé' }}</strong></div>
      <div><span>Invités</span><strong>{{ guests.length }}</strong></div>
      <div><span>Placés</span><strong>{{ seatedCount }}</strong></div>
      <div><span>À placer</span><strong>{{ unseatedCount }}</strong></div>
    </section>

    <section class="suggestion-card">
      <div><span class="eyebrow">SUGGESTION WEDDING+</span><h2>{{ suggestion.title }}</h2><p>{{ suggestion.text }}</p></div>
      <button @click="autoPlace" :disabled="!guests.length">✨ Placement suggéré</button>
    </section>

    <section class="layout-grid">
      <article v-for="table in tables" :key="table.name" class="table-card">
        <div class="table-head"><div><span>{{ table.label }}</span><strong>{{ table.name }}</strong></div><b>{{ table.guests.length }}/{{ table.capacity }}</b></div>
        <div class="round-table"><span>{{ table.guests.length }}</span><small>places</small></div>
        <div class="seated-list">
          <div v-for="g in table.guests" :key="g._id" class="seat"><span>{{ initials(g) }}</span><div><strong>{{ g.firstName }} {{ g.lastName }}</strong><small>{{ g.group || 'Invité' }}</small></div><button @click="assign(g,'')">×</button></div>
          <p v-if="!table.guests.length">Aucun invité placé.</p>
        </div>
      </article>
    </section>

    <section class="unseated-card">
      <div class="section-title"><div><span class="eyebrow">INVITÉS</span><h2>À placer</h2></div><span>{{ unseated.length }} restant(s)</span></div>
      <div v-if="unseated.length" class="unseated-list">
        <article v-for="g in unseated" :key="g._id">
          <div class="avatar">{{ initials(g) }}</div>
          <div class="guest-info"><strong>{{ g.firstName }} {{ g.lastName }}</strong><span>{{ g.group || 'Invité' }} · {{ rsvpLabel(g.rsvp) }}</span></div>
          <select :value="g.tableName || ''" @change="assign(g,$event.target.value)">
            <option value="">Choisir une table</option>
            <option v-for="t in tables" :key="t.name" :value="t.name" :disabled="t.guests.length>=t.capacity">{{ t.name }} · {{ t.guests.length }}/{{ t.capacity }}</option>
          </select>
        </article>
      </div>
      <div v-else class="empty">Tous les invités sont placés 🎉</div>
    </section>

    <Nav/>
  </main>
</template>

<script setup>
import {computed,onMounted,ref} from 'vue'
import Nav from '../components/Nav.vue'
import {crudApi,getWeddingId,weddingApi} from '../services/api'

const guestApi=crudApi('guests')
const guests=ref([])
const wedding=ref(null)
const tableNamesByStyle={
  'Traditionnel':['Table d’honneur','Famille des mariés','Notables & aînés','Famille proche','Amis de la famille','Jeunesse','Proches'],
  'Élégant':['Table d’honneur','Émeraude','Ivoire','Or','Rose poudré','Perle','Champagne'],
  'Romantique':['Table d’honneur','Amour','Pivoine','Rose','Jasmin','Éternité','Tendresse'],
  'Moderne':['Table d’honneur','Nova','Aura','Studio','Velours','Quartz','Lumière'],
  'Champêtre':['Table d’honneur','Olivier','Lavande','Sauge','Blé','Pivoine','Jardin'],
  'Intimiste':['Table d’honneur','Famille','Amis proches','Cercle 1','Cercle 2','Cercle 3','Cercle 4']
}
const suggestionByStyle={
  'Traditionnel':{title:'Respecter les liens familiaux et les places d’honneur',text:'Wedding+ vous conseille de garder les aînés et proches des familles près de la table d’honneur, puis de regrouper les invités par famille ou affinité.'},
  'Élégant':{title:'Des tables équilibrées et harmonieuses',text:'Privilégiez des groupes de 6 à 8 personnes avec des affinités communes et gardez une circulation fluide autour de la table d’honneur.'},
  'Romantique':{title:'Créer des tables chaleureuses',text:'Regroupez les couples, amis proches et familles qui se connaissent déjà afin de favoriser une ambiance douce et conviviale.'},
  'Moderne':{title:'Mixer les groupes avec logique',text:'Créez des tables dynamiques en mélangeant légèrement les groupes tout en conservant au moins deux personnes qui se connaissent par table.'},
  'Champêtre':{title:'Favoriser les grands groupes conviviaux',text:'Les tables familiales et amicales fonctionnent très bien ensemble. Wedding+ suggère des groupes détendus de 6 à 8 personnes.'},
  'Intimiste':{title:'Rester proche de tous les invités',text:'Avec un petit comité, rapprochez les tables et regroupez les invités selon les liens les plus forts avec les mariés.'}
}
const names=computed(()=>tableNamesByStyle[wedding.value?.style]||tableNamesByStyle['Élégant'])
const tables=computed(()=>names.value.map((name,index)=>({name,label:index===0?'Table principale':`Table ${index}`,capacity:index===0?8:8,guests:guests.value.filter(g=>g.tableName===name)})))
const unseated=computed(()=>guests.value.filter(g=>!g.tableName))
const seatedCount=computed(()=>guests.value.length-unseated.value.length)
const unseatedCount=computed(()=>unseated.value.length)
const suggestion=computed(()=>suggestionByStyle[wedding.value?.style]||{title:'Regrouper les invités par affinité',text:'Wedding+ vous conseille de placer ensemble les personnes d’un même groupe et d’équilibrer le nombre d’invités sur chaque table.'})
function initials(g){return `${g.firstName?.[0]||''}${g.lastName?.[0]||''}`.toUpperCase()}
function rsvpLabel(r){return r==='confirmed'?'Confirmé':r==='declined'?'Refusé':'En attente'}
async function assign(g,tableName){const r=await guestApi.update(g._id,{tableName});Object.assign(g,r.data)}
async function autoPlace(){
  const active=guests.value.filter(g=>g.rsvp!=='declined')
  const grouped=[...active].sort((a,b)=>(a.group||'').localeCompare(b.group||''))
  let cursor=0
  for(const g of grouped){const table=names.value[Math.min(Math.floor(cursor/8),names.value.length-1)];await assign(g,table);cursor++}
}
async function load(){
  const id=getWeddingId();if(!id)return
  const [gr,wr]=await Promise.all([guestApi.list(id),weddingApi.list(id)])
  guests.value=gr.data||[];wedding.value=wr.data?.[0]||null
}
onMounted(load)
</script>

<style scoped>
.table-page{padding-bottom:110px}.page-head{display:flex;gap:16px;align-items:flex-start;margin-bottom:20px}.page-head h1{margin:2px 0 4px;font:700 32px Georgia,serif;color:#3d2730}.page-head p{margin:0;color:#907981;font-size:13px}.eyebrow{font-size:10px;letter-spacing:.18em;color:#c58a35}.back{font-size:34px;color:#c91f60;text-decoration:none}.summary-card{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.summary-card>div,.suggestion-card,.table-card,.unseated-card{background:#fff;border:1px solid #f0dce3;border-radius:20px;box-shadow:0 8px 24px rgba(91,47,63,.05)}.summary-card>div{padding:16px}.summary-card span{display:block;color:#907981;font-size:12px}.summary-card strong{display:block;margin-top:5px;color:#3d2730;font-size:18px}.suggestion-card{padding:20px 22px;display:flex;justify-content:space-between;gap:20px;align-items:center;background:linear-gradient(135deg,#fff,#fff8f1)}.suggestion-card h2{margin:4px 0;font:600 21px Georgia,serif;color:#3d2730}.suggestion-card p{margin:0;color:#8d737c;line-height:1.55;font-size:13px;max-width:650px}.suggestion-card button{border:0;border-radius:14px;background:#c91f60;color:#fff;padding:12px 16px;font-weight:800;cursor:pointer;white-space:nowrap}.suggestion-card button:disabled{opacity:.45}.layout-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:16px 0}.table-card{padding:18px}.table-head{display:flex;justify-content:space-between;gap:12px}.table-head span,.table-head strong{display:block}.table-head span{font-size:10px;letter-spacing:.12em;color:#c58a35}.table-head strong{font:600 18px Georgia,serif;margin-top:4px;color:#3d2730}.table-head b{color:#c91f60}.round-table{width:108px;height:108px;border-radius:50%;border:8px solid #fff3f6;background:#fff9fb;margin:18px auto;display:grid;place-content:center;text-align:center;color:#c91f60}.round-table span{font-size:27px;font-weight:800}.round-table small{font-size:10px;color:#967f87}.seated-list{display:grid;gap:8px}.seated-list>p,.empty{text-align:center;color:#9d8990;font-size:12px;padding:16px}.seat{display:flex;align-items:center;gap:9px;padding:8px;background:#fff9fb;border-radius:12px}.seat>span,.avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#ffeaf1;color:#c91f60;font-size:11px;font-weight:800}.seat div{flex:1}.seat strong,.seat small{display:block}.seat strong{font-size:12px}.seat small{font-size:10px;color:#967f87;margin-top:2px}.seat button{border:0;background:transparent;color:#bb4168;font-size:20px;cursor:pointer}.unseated-card{padding:20px}.section-title{display:flex;align-items:end;justify-content:space-between;margin-bottom:12px}.section-title h2{margin:3px 0 0;font:600 22px Georgia,serif;color:#3d2730}.section-title>span{font-size:12px;color:#967f87}.unseated-list{display:grid;gap:9px}.unseated-list article{display:flex;align-items:center;gap:10px;padding:11px;border:1px solid #f2e4e8;border-radius:14px}.guest-info{flex:1}.guest-info strong,.guest-info span{display:block}.guest-info span{font-size:11px;color:#937d85;margin-top:3px}.unseated-list select{min-width:200px;border:1px solid #ead7de;border-radius:11px;padding:10px;background:#fff}@media(max-width:760px){.summary-card{grid-template-columns:1fr 1fr}.suggestion-card{align-items:flex-start;flex-direction:column}.suggestion-card button{width:100%}.layout-grid{grid-template-columns:1fr}.unseated-list article{align-items:flex-start;flex-wrap:wrap}.unseated-list select{width:100%;min-width:0}.page-head h1{font-size:27px}}
</style>