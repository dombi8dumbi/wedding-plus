<template>
  <main class="rsvp-page">
    <section class="card" v-if="loading"><p>Chargement de votre invitation…</p></section>
    <section class="card" v-else-if="error"><div class="mark">W+</div><h1>Invitation indisponible</h1><p>{{ error }}</p></section>
    <section class="card" v-else-if="done"><div class="mark">W+</div><span class="eyebrow">MERCI POUR VOTRE RÉPONSE</span><h1>{{ status==='confirmed'?'Nous avons hâte de vous voir 💍':'Votre réponse a bien été enregistrée' }}</h1><p>Wedding+ a transmis votre réponse à {{ wedding.partner1 }} & {{ wedding.partner2 }}.</p></section>
    <section class="card" v-else>
      <div class="mark">W+</div>
      <span class="eyebrow">VOUS ÊTES INVITÉ(E)</span>
      <h1>{{ wedding.partner1 }} & {{ wedding.partner2 }}</h1>
      <p class="hello">Bonjour <strong>{{ guest.firstName }}</strong>, nous serions heureux de vous compter parmi nous.</p>
      <div class="details"><div><small>Date</small><b>{{ formatDate(wedding.date) }}</b></div><div><small>Lieu</small><b>{{ wedding.location }}</b></div></div>
      <h2>Serez-vous présent(e) ?</h2>
      <div class="choices"><button class="yes" @click="choose('confirmed')">✓ Oui, avec plaisir</button><button class="no" @click="choose('declined')">Je ne pourrai pas venir</button></div>
      <div v-if="status==='declined'" class="reason-box"><label>Pourriez-vous nous indiquer la raison ?<textarea v-model.trim="reason" placeholder="Ex. déplacement, indisponibilité, raison personnelle…"></textarea></label><button class="submit" @click="send" :disabled="!reason">Envoyer ma réponse</button></div>
      <p v-if="submitError" class="error">{{ submitError }}</p>
    </section>
  </main>
</template>

<script setup>
import {onMounted,ref} from 'vue'
import {useRoute} from 'vue-router'
import {invitationApi} from '../services/api'
const route=useRoute(),loading=ref(true),error=ref(''),done=ref(false),guest=ref({}),wedding=ref({}),status=ref(''),reason=ref(''),submitError=ref('')
function formatDate(v){try{return new Intl.DateTimeFormat('fr-FR',{dateStyle:'full'}).format(new Date(v))}catch{return 'À confirmer'}}
async function load(){try{const r=await invitationApi.get(route.params.token);guest.value=r.data.guest;wedding.value=r.data.wedding||{};if(guest.value.rsvp==='confirmed'||guest.value.rsvp==='declined'){status.value=guest.value.rsvp;done.value=true}}catch(e){error.value=e.message}finally{loading.value=false}}
async function choose(value){status.value=value;if(value==='confirmed')await send()}
async function send(){submitError.value='';try{await invitationApi.respond(route.params.token,status.value,reason.value);done.value=true}catch(e){submitError.value=e.message}}
onMounted(load)
</script>

<style scoped>
.rsvp-page{min-height:100vh;display:grid;place-items:center;padding:28px;background:radial-gradient(circle at 12% 20%,#fff0f5,transparent 32%),radial-gradient(circle at 90% 85%,#fff5df,transparent 30%),#fffaf9}.card{width:min(100%,620px);background:#fff;border:1px solid #efdce3;border-radius:28px;padding:38px;box-shadow:0 18px 60px rgba(91,47,63,.08);text-align:center}.mark{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;margin:0 auto 18px;background:#fff2f6;color:#c91f60;font:700 24px Georgia,serif}.eyebrow{font-size:10px;letter-spacing:.18em;color:#b98237;font-weight:800}.card h1{font:600 clamp(34px,7vw,52px) Georgia,serif;color:#c91f60;margin:10px 0 16px}.hello{color:#715d65;line-height:1.7}.details{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:24px 0}.details div{background:#fff9f6;border:1px solid #f1e2e5;border-radius:16px;padding:15px;text-align:left}.details small,.details b{display:block}.details small{color:#9a8189;margin-bottom:5px}.details b{color:#3d2b32}.card h2{font:600 22px Georgia,serif;color:#3d2b32;margin-top:28px}.choices{display:grid;grid-template-columns:1fr 1fr;gap:10px}.choices button,.submit{min-height:50px;border:0;border-radius:14px;font-weight:800;cursor:pointer}.yes,.submit{background:#c91f60;color:#fff}.no{background:#fff0f4;color:#b82d5b}.reason-box{margin-top:18px;text-align:left}.reason-box label{font-size:12px;font-weight:700;color:#5b4850}.reason-box textarea{width:100%;min-height:100px;box-sizing:border-box;margin:8px 0 12px;border:1px solid #ead8df;border-radius:14px;padding:12px;font:inherit}.submit{width:100%}.submit:disabled{opacity:.45}.error{color:#b42350;font-size:12px}@media(max-width:520px){.card{padding:26px 20px}.details,.choices{grid-template-columns:1fr}}
</style>
