<template>
  <main class="screen guests-page">
    <header class="page-head">
      <RouterLink to="/dashboard" class="back">‹</RouterLink>
      <div><span class="eyebrow">WEDDING+</span><h1>Invités</h1></div>
      <div class="head-actions">
        <RouterLink to="/plan-table" class="table-btn">Plan de table</RouterLink>
        <button class="add-btn" @click="showForm = !showForm">＋ Ajouter</button>
      </div>
    </header>

    <section class="stats">
      <article><span>Total</span><strong>{{ guests.length }}</strong></article>
      <article><span>Confirmés</span><strong>{{ confirmed }}</strong></article>
      <article><span>En attente</span><strong>{{ pending }}</strong></article>
      <article><span>Refusés</span><strong>{{ declined }}</strong></article>
    </section>

    <section class="table-callout">
      <div><span class="eyebrow">INVITATIONS & PLACEMENT</span><h2>Invitez, suivez les réponses puis organisez les tables</h2><p>Chaque invité peut recevoir son lien RSVP par e-mail et WhatsApp. Les réponses remontent automatiquement dans Wedding+.</p></div>
      <RouterLink to="/plan-table" class="primary-link">Planifier les tables →</RouterLink>
    </section>

    <section v-if="showForm" class="form-card">
      <input v-model="form.firstName" placeholder="Prénom" />
      <input v-model="form.lastName" placeholder="Nom" />
      <input v-model="form.email" type="email" placeholder="E-mail" />
      <input v-model="form.phone" placeholder="WhatsApp ex. 33612345678" />
      <input v-model="form.group" placeholder="Groupe (Famille, Amis...)" />
      <button class="primary" @click="addGuest">Enregistrer l’invité</button>
    </section>

    <div class="tools"><input v-model="search" class="search" placeholder="Rechercher un invité" /><button class="remind" @click="runReminders">Vérifier les relances</button></div>
    <p v-if="notice" class="notice">{{ notice }}</p>

    <section class="guest-list">
      <article v-for="g in filteredGuests" :key="g._id" class="guest-card">
        <div class="avatar">{{ initials(g) }}</div>
        <div class="guest-info">
          <strong>{{ g.firstName }} {{ g.lastName }}</strong>
          <span>{{ g.group || 'Invité' }}<template v-if="g.tableName"> · {{ g.tableName }}</template></span>
          <small>{{ g.email || 'Sans e-mail' }} · {{ g.phone || 'Sans WhatsApp' }}</small>
          <small v-if="g.refusalReason" class="reason">Motif du refus : {{ g.refusalReason }}</small>
          <small v-else-if="g.invitationSentAt">Invitation envoyée le {{ formatDate(g.invitationSentAt) }}</small>
        </div>
        <span :class="['status',g.rsvp||'pending']">{{ labelStatus(g.rsvp) }}</span>
        <button class="mail" @click="sendInvitation(g)" :disabled="sending===g._id">{{ sending===g._id?'Envoi…':'E-mail' }}</button>
        <button v-if="g.phone" class="wa" @click="openWhatsApp(g)">WhatsApp</button>
        <button class="delete" @click="removeGuest(g._id)">Supprimer</button>
      </article>
      <p v-if="!filteredGuests.length" class="empty">Aucun invité trouvé.</p>
    </section>
    <Nav/>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import Nav from '../components/Nav.vue'
import { crudApi, getWeddingId, invitationApi } from '../services/api'

const api=crudApi('guests'),guests=ref([]),search=ref(''),showForm=ref(false),notice=ref(''),sending=ref('')
const form=reactive({firstName:'',lastName:'',email:'',phone:'',group:'Famille',rsvp:'pending'})
const confirmed=computed(()=>guests.value.filter(g=>g.rsvp==='confirmed').length)
const pending=computed(()=>guests.value.filter(g=>(g.rsvp||'pending')==='pending').length)
const declined=computed(()=>guests.value.filter(g=>g.rsvp==='declined').length)
const filteredGuests=computed(()=>{const q=search.value.toLowerCase().trim();if(!q)return guests.value;return guests.value.filter(g=>`${g.firstName} ${g.lastName} ${g.group} ${g.tableName||''} ${g.email||''}`.toLowerCase().includes(q))})
function initials(g){return `${g.firstName?.[0]||''}${g.lastName?.[0]||''}`.toUpperCase()}
function labelStatus(s){return s==='confirmed'?'Confirmé':s==='declined'?'Refusé':'En attente'}
function formatDate(v){try{return new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium'}).format(new Date(v))}catch{return ''}}
async function load(){guests.value=(await api.list(getWeddingId())).data}
async function addGuest(){if(!form.firstName.trim())return;const r=await api.create({...form,wedding:getWeddingId(),tableName:''});guests.value.unshift(r.data);Object.assign(form,{firstName:'',lastName:'',email:'',phone:'',group:'Famille',rsvp:'pending'});showForm.value=false}
async function sendInvitation(g){sending.value=g._id;notice.value='';try{const r=await invitationApi.send(g._id);Object.assign(g,r.data.guest);g._whatsappUrl=r.data.whatsappUrl;notice.value=r.data.emailSent?'Invitation envoyée par e-mail.':'Invitation préparée, mais aucun e-mail n’a été envoyé.';if(r.data.whatsappUrl)notice.value+=' Le message WhatsApp est prêt.'}catch(e){notice.value=e.message}finally{sending.value=''}}
async function openWhatsApp(g){try{if(!g._whatsappUrl){const r=await invitationApi.send(g._id);Object.assign(g,r.data.guest);g._whatsappUrl=r.data.whatsappUrl}if(g._whatsappUrl)window.open(g._whatsappUrl,'_blank');else notice.value='Ajoutez un numéro WhatsApp à cet invité.'}catch(e){notice.value=e.message}}
async function runReminders(){try{const r=await invitationApi.runReminders();notice.value=`Relances dues : ${r.data.checked} · envoyées : ${r.data.sent}`;await load()}catch(e){notice.value=e.message}}
async function removeGuest(id){await api.remove(id);guests.value=guests.value.filter(g=>g._id!==id)}
onMounted(load)
</script>

<style scoped>
.guests-page{padding-bottom:110px}.page-head{display:flex;align-items:center;gap:16px;margin-bottom:22px}.page-head h1{margin:2px 0 0;font:700 30px Georgia,serif;color:#3d2730}.eyebrow{font-size:11px;letter-spacing:.18em;color:#c58a35}.back{font-size:34px;color:#c91f60;text-decoration:none}.head-actions{margin-left:auto;display:flex;gap:9px}.add-btn,.primary,.table-btn,.primary-link,.remind,.mail,.wa{border:0;border-radius:12px;padding:11px 15px;font-weight:700;cursor:pointer;text-decoration:none}.add-btn,.primary,.mail{background:#c91f60;color:#fff}.table-btn{background:#fff4f7;color:#c91f60;border:1px solid #efd9e1}.wa{background:#eaf8ef;color:#19713e}.remind{background:#fff3e3;color:#9b6418}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stats article,.form-card,.guest-card,.table-callout{background:#fff;border:1px solid #f1dfe5;border-radius:18px;box-shadow:0 8px 24px rgba(91,47,63,.06)}.stats article{padding:18px}.stats span{display:block;color:#8d737c;font-size:13px}.stats strong{font-size:28px;color:#c91f60}.table-callout{margin:16px 0;padding:20px 22px;display:flex;justify-content:space-between;gap:20px;align-items:center;background:linear-gradient(135deg,#fff,#fff8f5)}.table-callout h2{font:600 22px Georgia,serif;color:#3d2730;margin:5px 0}.table-callout p{margin:0;color:#8d737c;font-size:13px;line-height:1.55;max-width:650px}.primary-link{background:#c91f60;color:#fff;white-space:nowrap}.form-card{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px;margin:16px 0}.form-card input{border:1px solid #ecd9df;border-radius:12px;padding:11px;background:#fff}.tools{display:flex;gap:10px;align-items:center}.search{flex:1;margin:18px 0;padding:14px 16px;border:1px solid #ead7de;border-radius:14px}.notice{background:#fff8e8;border:1px solid #f0dfb9;padding:10px 13px;border-radius:12px;color:#74572e}.guest-list{display:grid;gap:10px}.guest-card{display:flex;align-items:center;gap:10px;padding:14px 16px;flex-wrap:wrap}.avatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff0f5;color:#c91f60;font-weight:800}.guest-info{flex:1;min-width:220px}.guest-info strong,.guest-info span,.guest-info small{display:block}.guest-info span,.guest-info small{font-size:12px;color:#927b83;margin-top:4px}.guest-info .reason{color:#b52e55}.status{padding:8px 10px;border-radius:999px;font-size:11px;font-weight:700}.status.pending{background:#fff4de;color:#97641c}.status.confirmed{background:#eef8f1;color:#267846}.status.declined{background:#fff0f3;color:#b52e55}.delete{border:0;background:#fff2f5;color:#bd365e;padding:9px 12px;border-radius:10px;cursor:pointer}.empty{text-align:center;color:#927b83;padding:30px}@media(max-width:760px){.stats{grid-template-columns:1fr 1fr}.form-card{grid-template-columns:1fr}.page-head{align-items:flex-start;flex-wrap:wrap}.head-actions{width:100%;margin-left:0}.head-actions>*{flex:1;text-align:center}.tools{align-items:stretch;flex-direction:column}.search{width:100%;margin:14px 0 0}.guest-card{align-items:flex-start}.page-head h1{font-size:25px}.table-callout{align-items:flex-start;flex-direction:column}.primary-link{width:100%;box-sizing:border-box;text-align:center}}
</style>
