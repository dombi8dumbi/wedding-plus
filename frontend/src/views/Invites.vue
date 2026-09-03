<template>
  <main class="screen guests-page">
    <header class="page-head">
      <RouterLink to="/dashboard" class="back">‹</RouterLink>
      <div><span class="eyebrow">WEDDING+</span><h1>Invités</h1></div>
      <button class="add-btn" @click="showForm = !showForm">＋ Ajouter</button>
    </header>

    <section class="stats">
      <article><span>Total</span><strong>{{ guests.length }}</strong></article>
      <article><span>Confirmés</span><strong>{{ confirmed }}</strong></article>
      <article><span>En attente</span><strong>{{ pending }}</strong></article>
      <article><span>Refusés</span><strong>{{ declined }}</strong></article>
    </section>

    <section v-if="showForm" class="form-card">
      <input v-model="form.firstName" placeholder="Prénom" />
      <input v-model="form.lastName" placeholder="Nom" />
      <input v-model="form.group" placeholder="Groupe (Famille, Amis...)" />
      <select v-model="form.rsvp"><option value="pending">En attente</option><option value="confirmed">Confirmé</option><option value="declined">Refusé</option></select>
      <button class="primary" @click="addGuest">Enregistrer l’invité</button>
    </section>

    <input v-model="search" class="search" placeholder="Rechercher un invité" />

    <section class="guest-list">
      <article v-for="g in filteredGuests" :key="g._id" class="guest-card">
        <div class="avatar">{{ initials(g) }}</div>
        <div class="guest-info"><strong>{{ g.firstName }} {{ g.lastName }}</strong><span>{{ g.group || 'Invité' }}</span></div>
        <select :value="g.rsvp" @change="changeStatus(g,$event.target.value)">
          <option value="confirmed">Confirmé</option><option value="pending">En attente</option><option value="declined">Refusé</option>
        </select>
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
import { crudApi, getWeddingId } from '../services/api'

const api = crudApi('guests')
const guests = ref([])
const search = ref('')
const showForm = ref(false)
const form = reactive({firstName:'',lastName:'',group:'Famille',rsvp:'pending'})
const confirmed = computed(()=>guests.value.filter(g=>g.rsvp==='confirmed').length)
const pending = computed(()=>guests.value.filter(g=>g.rsvp==='pending').length)
const declined = computed(()=>guests.value.filter(g=>g.rsvp==='declined').length)
const filteredGuests = computed(()=>{
  const q=search.value.toLowerCase().trim(); if(!q) return guests.value
  return guests.value.filter(g=>`${g.firstName} ${g.lastName} ${g.group}`.toLowerCase().includes(q))
})
function initials(g){ return `${g.firstName?.[0]||''}${g.lastName?.[0]||''}`.toUpperCase() }
async function load(){ guests.value=(await api.list(getWeddingId())).data }
async function addGuest(){
  if(!form.firstName.trim()) return
  const r=await api.create({...form,wedding:getWeddingId()}); guests.value.unshift(r.data)
  Object.assign(form,{firstName:'',lastName:'',group:'Famille',rsvp:'pending'}); showForm.value=false
}
async function changeStatus(g,status){ const r=await api.update(g._id,{rsvp:status}); Object.assign(g,r.data) }
async function removeGuest(id){ await api.remove(id); guests.value=guests.value.filter(g=>g._id!==id) }
onMounted(load)
</script>

<style scoped>
.guests-page{padding-bottom:110px}.page-head{display:flex;align-items:center;gap:16px;margin-bottom:22px}.page-head h1{margin:2px 0 0;font:700 30px Georgia,serif;color:#3d2730}.eyebrow{font-size:11px;letter-spacing:.18em;color:#c58a35}.back{font-size:34px;color:#c91f60;text-decoration:none}.add-btn,.primary{border:0;background:#c91f60;color:#fff;border-radius:14px;padding:12px 18px;font-weight:700;cursor:pointer;margin-left:auto}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stats article,.form-card,.guest-card{background:#fff;border:1px solid #f1dfe5;border-radius:18px;box-shadow:0 8px 24px rgba(91,47,63,.06)}.stats article{padding:18px}.stats span{display:block;color:#8d737c;font-size:13px}.stats strong{font-size:28px;color:#c91f60}.form-card{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:16px;margin:16px 0}.form-card input,.form-card select,.guest-card select{border:1px solid #ecd9df;border-radius:12px;padding:11px;background:#fff}.form-card .primary{margin:0}.search{width:100%;box-sizing:border-box;margin:18px 0;padding:14px 16px;border:1px solid #ead7de;border-radius:14px}.guest-list{display:grid;gap:10px}.guest-card{display:flex;align-items:center;gap:14px;padding:14px 16px}.avatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff0f5;color:#c91f60;font-weight:800}.guest-info{flex:1}.guest-info strong,.guest-info span{display:block}.guest-info span{font-size:12px;color:#927b83;margin-top:4px}.delete{border:0;background:#fff2f5;color:#bd365e;padding:9px 12px;border-radius:10px;cursor:pointer}.empty{text-align:center;color:#927b83;padding:30px}@media(max-width:760px){.stats{grid-template-columns:1fr 1fr}.form-card{grid-template-columns:1fr}.page-head{align-items:flex-start;flex-wrap:wrap}.add-btn{margin-left:0}.guest-card{align-items:flex-start;flex-wrap:wrap}.guest-info{min-width:150px}.guest-card select{flex:1}.page-head h1{font-size:25px}}
</style>