<template>
  <main class="onboarding-page">
    <section class="intro-panel">
      <div class="brand"><div class="brand-mark">W<span>+</span></div><div><b>WEDDING+</b><small>VOTRE MARIAGE COMMENCE ICI</small></div></div>
      <div class="intro-copy">
        <span class="kicker">CONFIGURATION PERSONNALISÉE</span>
        <h1>Parlez-nous de<br><em>votre mariage.</em></h1>
        <p>Wedding+ utilise ces informations pour préparer un espace adapté à votre budget, votre date et vos priorités.</p>
        <div class="promise-list">
          <div><span>01</span><p><b>Votre propre espace</b><small>Aucune donnée d'un autre couple n'est mélangée aux vôtres.</small></p></div>
          <div><span>02</span><p><b>Suggestions intelligentes</b><small>Planning, budget et premières tâches sont proposés automatiquement.</small></p></div>
          <div><span>03</span><p><b>Vous gardez le contrôle</b><small>Toutes les suggestions restent modifiables ou supprimables.</small></p></div>
        </div>
      </div>
      <div class="rings"><i></i><i></i><b>✦</b></div>
    </section>

    <section class="form-panel">
      <div class="step-head"><span>ÉTAPE 1 SUR 1</span><b>Créons votre espace</b><p>Quelques informations suffisent. Vous pourrez tout modifier plus tard.</p></div>
      <form @submit.prevent="submit">
        <div class="grid two">
          <label>Votre prénom<input v-model.trim="form.partner1" required placeholder="Ex. Thérèse"></label>
          <label>Prénom de votre partenaire<input v-model.trim="form.partner2" required placeholder="Ex. Daniel"></label>
        </div>
        <div class="grid two">
          <label>Date prévue<input v-model="form.date" :min="today" type="date" required></label>
          <label>Ville ou lieu<input v-model.trim="form.location" placeholder="Ex. Paris, Château..." /></label>
        </div>
        <div class="grid two">
          <label>Budget prévisionnel (€)<input v-model.number="form.budgetTarget" type="number" min="1000" step="500" placeholder="15000"></label>
          <label>Nombre d'invités estimé<input v-model.number="form.guestTarget" type="number" min="2" placeholder="100"></label>
        </div>
        <label>Ambiance / style du mariage
          <select v-model="form.style">
            <option>Élégant</option><option>Romantique</option><option>Moderne</option><option>Chic & minimaliste</option><option>Traditionnel</option><option>Champêtre</option><option>Glamour</option><option>Autre</option>
          </select>
        </label>

        <fieldset>
          <legend>Qu'est-ce qui compte le plus pour vous ? <small>Choisissez jusqu'à 3 priorités.</small></legend>
          <div class="priority-grid">
            <button v-for="p in priorities" :key="p.value" type="button" :class="['priority',{active:form.priorities.includes(p.value)}]" @click="togglePriority(p.value)"><span>{{ p.icon }}</span><b>{{ p.label }}</b></button>
          </div>
        </fieldset>

        <div class="generated-note"><span>✦</span><div><b>Ce que Wedding+ va préparer</b><p>6 premières tâches · 6 catégories de budget · un planning Jour J · vos premières alertes.</p></div></div>
        <p v-if="error" class="error">{{ error }}</p>
        <button class="submit" :disabled="loading">{{ loading ? 'Préparation de votre espace…' : 'Créer mon espace Wedding+' }} <span>→</span></button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, onboardingApi, updateCurrentUser } from '../services/api.js'

const router=useRouter(),loading=ref(false),error=ref('')
const user=getCurrentUser(); const firstName=(user?.name||'').split(' ')[0]
const today=new Date().toISOString().slice(0,10)
const future=new Date();future.setMonth(future.getMonth()+10)
const form=reactive({partner1:firstName,partner2:'',date:future.toISOString().slice(0,10),location:'',budgetTarget:15000,guestTarget:100,style:'Élégant',priorities:[]})
const priorities=[
  {value:'budget',label:'Respecter le budget',icon:'€'},
  {value:'guests',label:'Expérience invités',icon:'♡'},
  {value:'decor',label:'Décoration',icon:'✦'},
  {value:'food',label:'Repas & réception',icon:'◌'},
  {value:'photos',label:'Photos & souvenirs',icon:'□'},
  {value:'planning',label:'Organisation fluide',icon:'✓'}
]
function togglePriority(value){const i=form.priorities.indexOf(value);if(i>=0)form.priorities.splice(i,1);else if(form.priorities.length<3)form.priorities.push(value)}
async function submit(){error.value='';loading.value=true;try{const r=await onboardingApi.create({...form});updateCurrentUser(r.data.user);router.replace('/dashboard')}catch(e){error.value=e.message}finally{loading.value=false}}
</script>

<style scoped>
.onboarding-page{min-height:100vh;display:grid;grid-template-columns:minmax(390px,.82fr) minmax(560px,1.18fr);background:#fff}.intro-panel{position:relative;overflow:hidden;padding:48px 58px;display:flex;flex-direction:column;background:radial-gradient(circle at 15% 78%,rgba(213,51,106,.13),transparent 30%),radial-gradient(circle at 88% 15%,rgba(197,138,53,.15),transparent 28%),linear-gradient(145deg,#fff9f7,#fff1f5 60%,#fff9ed);color:#37272d}.brand{display:flex;align-items:center;gap:13px;z-index:2}.brand>div:last-child{display:grid;gap:4px}.brand b{font:700 14px Georgia,serif;letter-spacing:.16em;color:#bd255b}.brand small{font-size:8px;letter-spacing:.15em;color:#ac8350}.brand-mark{width:52px;height:52px;border-radius:17px;background:rgba(255,255,255,.88);border:1px solid rgba(207,108,139,.25);display:grid;place-items:center;font:italic 30px Georgia,serif;color:#ca2860;box-shadow:0 12px 30px rgba(142,66,94,.1)}.brand-mark span{color:#c28a3d;font:700 17px Arial}.intro-copy{margin:auto 0;max-width:600px;z-index:2}.kicker,.step-head>span{font-size:10px;font-weight:800;letter-spacing:.18em;color:#b27b39}.intro-copy h1{font:500 clamp(40px,4.2vw,65px)/1.06 Georgia,serif;margin:15px 0 18px}.intro-copy h1 em{font-weight:500;color:#c6235e}.intro-copy>p{font-size:14px;line-height:1.75;color:#806b73;max-width:500px}.promise-list{display:grid;gap:12px;margin-top:34px}.promise-list>div{display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:start}.promise-list>div>span{width:34px;height:34px;border-radius:12px;background:rgba(255,255,255,.8);display:grid;place-items:center;font-size:10px;font-weight:800;color:#c58a35}.promise-list p{margin:0;display:grid;gap:4px}.promise-list b{font-size:12px}.promise-list small{font-size:10px;color:#8e7880;line-height:1.5}.rings{position:absolute;width:340px;height:280px;right:-110px;bottom:-20px;opacity:.12}.rings i{position:absolute;width:150px;height:150px;border:12px solid #b47b2e;border-radius:50%;bottom:20px}.rings i:first-child{left:20px}.rings i:nth-child(2){left:115px;bottom:52px}.rings b{position:absolute;right:62px;top:24px;color:#b47b2e;font-size:52px}.form-panel{padding:44px clamp(32px,6vw,82px);overflow:auto;display:flex;flex-direction:column;justify-content:center}.step-head{margin-bottom:22px}.step-head b{display:block;font:500 33px Georgia,serif;margin:8px 0;color:#38282e}.step-head p{margin:0;color:#8a7880;font-size:13px}.form-panel form{display:grid;gap:15px}.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}label{display:grid;gap:7px;font-size:11px;font-weight:800;color:#5c4850}input,select{width:100%;height:48px;border:1px solid #eadde1;border-radius:13px;background:#fff;padding:0 14px;outline:none;color:#382c31}input:focus,select:focus{border-color:#dc6990;box-shadow:0 0 0 4px rgba(220,105,144,.08)}fieldset{border:0;padding:3px 0;margin:0}legend{font-size:11px;font-weight:800;color:#5c4850;margin-bottom:10px}legend small{font-weight:500;color:#a39097;margin-left:5px}.priority-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.priority{min-height:67px;border:1px solid #eee0e5;border-radius:15px;background:#fff;display:flex;align-items:center;gap:9px;padding:10px;text-align:left;color:#5a4850;cursor:pointer}.priority span{width:31px;height:31px;border-radius:10px;background:#fff2f6;color:#c91f60;display:grid;place-items:center;font-weight:800}.priority b{font-size:10px}.priority.active{border-color:#df7097;background:#fff6f9;color:#b82459;box-shadow:0 6px 18px rgba(184,36,89,.07)}.generated-note{display:flex;gap:11px;padding:13px 15px;border-radius:15px;background:#fff9ed;border:1px solid #f1dfbd;color:#76552d}.generated-note>span{font-size:20px;color:#c58a35}.generated-note div{display:grid;gap:3px}.generated-note b{font-size:11px}.generated-note p{margin:0;font-size:10px;line-height:1.5}.error{margin:0;padding:10px 12px;border-radius:11px;background:#fff1f4;color:#a62550;font-size:11px}.submit{height:52px;border:0;border-radius:15px;background:linear-gradient(100deg,#e8477d,#c81f5e);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 12px 26px rgba(200,31,94,.2);cursor:pointer}.submit:disabled{opacity:.6}.submit span{font-size:18px}@media(max-width:900px){.onboarding-page{grid-template-columns:1fr}.intro-panel{display:none}.form-panel{min-height:100vh;padding:30px 20px}.priority-grid{grid-template-columns:1fr 1fr}}@media(max-width:520px){.grid.two{grid-template-columns:1fr}.priority-grid{grid-template-columns:1fr 1fr}.step-head b{font-size:28px}}
</style>
