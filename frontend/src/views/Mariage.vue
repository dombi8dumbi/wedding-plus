<template>
  <main class="screen marriage-page">
    <header class="page-head">
      <RouterLink to="/dashboard" class="back">‹</RouterLink>
      <div><span class="eyebrow">WEDDING+</span><h1>Mon mariage</h1></div>
      <button class="edit-btn" @click="editing=!editing">{{ editing ? 'Fermer' : 'Modifier' }}</button>
    </header>

    <section class="hero">
      <div><span class="tag">Votre mariage</span><h2>{{ wedding.partner1 }} & {{ wedding.partner2 }}</h2><p>{{ formattedDate }} · {{ wedding.location }}</p></div>
      <div class="countdown"><strong>J-{{ daysLeft }}</strong><span>avant le grand jour</span></div>
    </section>

    <section v-if="editing" class="edit-card">
      <input v-model="wedding.partner1" placeholder="Partenaire 1" />
      <input v-model="wedding.partner2" placeholder="Partenaire 2" />
      <input v-model="dateInput" type="date" />
      <input v-model="wedding.location" placeholder="Lieu" />
      <input v-model.number="wedding.budgetTarget" type="number" placeholder="Budget" />
      <button class="primary" @click="saveWedding">Enregistrer les modifications</button>
    </section>

    <section class="info-grid">
      <article><span>Date</span><strong>{{ formattedDate }}</strong></article>
      <article><span>Lieu</span><strong>{{ wedding.location }}</strong></article>
      <article><span>Budget cible</span><strong>{{ Number(wedding.budgetTarget||0).toLocaleString('fr-FR') }} €</strong></article>
      <article><span>Statut</span><strong class="status">En préparation</strong></article>
    </section>

    <section class="day-card">
      <div class="section-title"><div><span class="eyebrow">MODE JOUR J</span><h2>Déroulé de la journée</h2></div><button class="outline" @click="showTimelineForm=!showTimelineForm">＋ Ajouter une étape</button></div>
      <div v-if="showTimelineForm" class="timeline-form">
        <input v-model="timelineForm.title" placeholder="Étape" />
        <input v-model="timelineForm.time" type="time" />
        <input v-model="timelineForm.location" placeholder="Lieu" />
        <button class="primary" @click="addTimeline">Ajouter</button>
      </div>
      <div class="timeline">
        <article v-for="item in timeline" :key="item._id" class="timeline-item">
          <div class="time">{{ timeOf(item.startTime) }}</div>
          <div class="dot"></div>
          <div class="timeline-info"><strong>{{ item.title }}</strong><span>{{ item.location || item.responsible || 'À confirmer' }}</span></div>
          <button :class="['done-btn',{done:item.status==='done'}]" @click="toggleTimeline(item)">{{ item.status==='done' ? '✓ Terminé' : 'Marquer terminé' }}</button>
        </article>
      </div>
    </section>
    <Nav/>
  </main>
</template>

<script setup>
import { computed,onMounted,reactive,ref } from 'vue'
import Nav from '../components/Nav.vue'
import { crudApi,getWeddingId,weddingApi } from '../services/api'
const wedding=reactive({partner1:'Glorie',partner2:'Jordan',date:'2027-06-12T14:00:00.000Z',location:'Domaine de la Roseraie, Paris',budgetTarget:20000})
const editing=ref(false),showTimelineForm=ref(false),timeline=ref([]),dateInput=ref('2027-06-12')
const timelineApi=crudApi('timeline')
const timelineForm=reactive({title:'',time:'12:00',location:''})
const formattedDate=computed(()=>new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(wedding.date)))
const daysLeft=computed(()=>Math.max(0,Math.ceil((new Date(wedding.date)-new Date())/86400000)))
function timeOf(v){return new Intl.DateTimeFormat('fr-FR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'}).format(new Date(v))}
async function load(){const list=await weddingApi.list();if(list.data?.[0]){Object.assign(wedding,list.data[0]);dateInput.value=wedding.date.slice(0,10)};timeline.value=(await timelineApi.list(getWeddingId())).data}
async function saveWedding(){wedding.date=`${dateInput.value}T14:00:00.000Z`;await weddingApi.create({...wedding,_id:getWeddingId()});editing.value=false}
async function addTimeline(){if(!timelineForm.title.trim())return;const date=dateInput.value||wedding.date.slice(0,10);const r=await timelineApi.create({wedding:getWeddingId(),title:timelineForm.title,startTime:`${date}T${timelineForm.time}:00.000Z`,location:timelineForm.location,status:'planned'});timeline.value.push(r.data);timeline.value.sort((a,b)=>new Date(a.startTime)-new Date(b.startTime));Object.assign(timelineForm,{title:'',time:'12:00',location:''});showTimelineForm.value=false}
async function toggleTimeline(item){const status=item.status==='done'?'planned':'done';const r=await timelineApi.update(item._id,{status});Object.assign(item,r.data)}
onMounted(load)
</script>

<style scoped>
.marriage-page{padding-bottom:110px}.page-head{display:flex;align-items:center;gap:16px;margin-bottom:22px}.page-head h1{margin:2px 0 0;font:700 30px Georgia,serif;color:#3d2730}.eyebrow{font-size:11px;letter-spacing:.18em;color:#c58a35}.back{font-size:34px;color:#c91f60;text-decoration:none}.edit-btn,.primary,.outline,.done-btn{border:0;border-radius:14px;padding:11px 16px;font-weight:700;cursor:pointer}.edit-btn,.primary{background:#c91f60;color:#fff}.edit-btn{margin-left:auto}.outline{background:#fff7ea;color:#9b6825}.hero{display:flex;justify-content:space-between;align-items:center;padding:28px;border-radius:24px;background:linear-gradient(135deg,#fff0f5,#fff9ee);border:1px solid #f0d9e1}.hero h2{font:700 38px Georgia,serif;color:#a71d53;margin:8px 0}.hero p{margin:0;color:#7f6770}.tag{display:inline-block;background:#fff;color:#c91f60;padding:6px 10px;border-radius:999px;font-size:12px}.countdown{text-align:center;padding:20px 26px;background:#fff;border-radius:20px;box-shadow:0 8px 24px rgba(91,47,63,.07)}.countdown strong,.countdown span{display:block}.countdown strong{font-size:36px;color:#c58a35}.countdown span{font-size:12px;color:#8d737c}.edit-card{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;background:#fff;padding:16px;border-radius:18px;margin-top:16px}.edit-card input,.timeline-form input{border:1px solid #ecd9df;border-radius:12px;padding:11px}.info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.info-grid article{background:#fff;border:1px solid #f1dfe5;border-radius:18px;padding:18px}.info-grid span,.info-grid strong{display:block}.info-grid span{font-size:12px;color:#8d737c;margin-bottom:7px}.status{color:#c91f60}.day-card{background:#fff;border:1px solid #f1dfe5;border-radius:22px;padding:22px}.section-title{display:flex;justify-content:space-between;align-items:center;gap:15px}.section-title h2{margin:4px 0 0;font:700 24px Georgia,serif;color:#3d2730}.timeline-form{display:grid;grid-template-columns:2fr 1fr 2fr auto;gap:10px;margin:18px 0;padding:14px;background:#fff8fb;border-radius:16px}.timeline{margin-top:20px}.timeline-item{display:grid;grid-template-columns:70px 14px 1fr auto;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid #f1e5e8}.time{font-weight:800;color:#c91f60}.dot{width:11px;height:11px;border-radius:50%;background:#c58a35}.timeline-info strong,.timeline-info span{display:block}.timeline-info span{font-size:12px;color:#8d737c;margin-top:4px}.done-btn{background:#fff2f5;color:#bd365e}.done-btn.done{background:#eef8f0;color:#4f8b5f}@media(max-width:760px){.hero{align-items:flex-start;gap:18px;flex-direction:column}.hero h2{font-size:29px}.countdown{width:100%;box-sizing:border-box}.info-grid{grid-template-columns:1fr 1fr}.edit-card,.timeline-form{grid-template-columns:1fr}.timeline-item{grid-template-columns:55px 12px 1fr}.done-btn{grid-column:3}.section-title{align-items:flex-start;flex-direction:column}.page-head{flex-wrap:wrap}.edit-btn{margin-left:0}}
</style>