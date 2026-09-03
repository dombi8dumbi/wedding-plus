<template>
  <main class="screen vendors-page">
    <header class="page-head">
      <RouterLink to="/dashboard" class="back">‹</RouterLink>
      <div><span class="eyebrow">WEDDING+</span><h1>Prestataires</h1></div>
      <button class="add-btn" @click="showForm=!showForm">＋ Ajouter</button>
    </header>

    <section class="stats">
      <article><span>Total</span><strong>{{ vendors.length }}</strong></article>
      <article><span>Réservés</span><strong>{{ booked }}</strong></article>
      <article><span>À contacter</span><strong>{{ contacted }}</strong></article>
      <article><span>Budget engagé</span><strong>{{ totalPrice.toLocaleString('fr-FR') }} €</strong></article>
    </section>

    <section v-if="showForm" class="form-card">
      <input v-model="form.name" placeholder="Nom du prestataire" />
      <input v-model="form.category" placeholder="Catégorie" />
      <input v-model.number="form.price" type="number" placeholder="Prix" />
      <select v-model="form.status"><option value="contacted">Contacté</option><option value="booked">Réservé</option><option value="paid">Payé</option></select>
      <button class="primary" @click="addVendor">Enregistrer</button>
    </section>

    <section class="vendor-list">
      <article v-for="p in vendors" :key="p._id" class="vendor-card">
        <div class="icon">{{ iconFor(p.category) }}</div>
        <div class="info"><strong>{{ p.name }}</strong><span>{{ p.category }}</span></div>
        <div class="price">{{ Number(p.price||0).toLocaleString('fr-FR') }} €</div>
        <select :value="p.status" @change="changeStatus(p,$event.target.value)">
          <option value="contacted">Contacté</option><option value="booked">Réservé</option><option value="paid">Payé</option>
        </select>
        <button class="delete" @click="removeVendor(p._id)">Supprimer</button>
      </article>
    </section>
    <Nav/>
  </main>
</template>

<script setup>
import { computed,onMounted,reactive,ref } from 'vue'
import Nav from '../components/Nav.vue'
import { crudApi,getWeddingId } from '../services/api'
const api=crudApi('vendors')
const vendors=ref([]),showForm=ref(false)
const form=reactive({name:'',category:'Traiteur',price:0,status:'contacted'})
const booked=computed(()=>vendors.value.filter(v=>['booked','paid'].includes(v.status)).length)
const contacted=computed(()=>vendors.value.filter(v=>v.status==='contacted').length)
const totalPrice=computed(()=>vendors.value.reduce((a,v)=>a+(Number(v.price)||0),0))
function iconFor(c=''){const s=c.toLowerCase();if(s.includes('photo'))return '📷';if(s.includes('fleur')||s.includes('décor'))return '✿';if(s.includes('dj')||s.includes('anim'))return '♫';if(s.includes('traiteur'))return '🍽';return '♡'}
async function load(){vendors.value=(await api.list(getWeddingId())).data}
async function addVendor(){if(!form.name.trim())return;const r=await api.create({...form,wedding:getWeddingId()});vendors.value.unshift(r.data);Object.assign(form,{name:'',category:'Traiteur',price:0,status:'contacted'});showForm.value=false}
async function changeStatus(v,status){const r=await api.update(v._id,{status});Object.assign(v,r.data)}
async function removeVendor(id){await api.remove(id);vendors.value=vendors.value.filter(v=>v._id!==id)}
onMounted(load)
</script>

<style scoped>
.vendors-page{padding-bottom:110px}.page-head{display:flex;align-items:center;gap:16px;margin-bottom:22px}.page-head h1{margin:2px 0 0;font:700 30px Georgia,serif;color:#3d2730}.eyebrow{font-size:11px;letter-spacing:.18em;color:#c58a35}.back{font-size:34px;color:#c91f60;text-decoration:none}.add-btn,.primary{border:0;background:#c91f60;color:#fff;border-radius:14px;padding:12px 18px;font-weight:700;cursor:pointer;margin-left:auto}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.stats article,.form-card,.vendor-card{background:#fff;border:1px solid #f1dfe5;border-radius:18px;box-shadow:0 8px 24px rgba(91,47,63,.06)}.stats article{padding:18px}.stats span{display:block;color:#8d737c;font-size:13px}.stats strong{font-size:22px;color:#c91f60}.form-card{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:16px;margin-bottom:18px}.form-card input,.form-card select,.vendor-card select{border:1px solid #ecd9df;border-radius:12px;padding:11px;background:#fff}.form-card .primary{margin:0}.vendor-list{display:grid;gap:10px}.vendor-card{display:flex;align-items:center;gap:14px;padding:15px 16px}.icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:#fff7eb;color:#c58a35;font-size:20px}.info{flex:1}.info strong,.info span{display:block}.info span{font-size:12px;color:#927b83;margin-top:4px}.price{font-weight:800;color:#3d2730}.delete{border:0;background:#fff2f5;color:#bd365e;padding:9px 12px;border-radius:10px;cursor:pointer}@media(max-width:760px){.stats{grid-template-columns:1fr 1fr}.form-card{grid-template-columns:1fr}.vendor-card{align-items:flex-start;flex-wrap:wrap}.info{min-width:150px}.page-head{flex-wrap:wrap}.add-btn{margin-left:0}.page-head h1{font-size:25px}}
</style>