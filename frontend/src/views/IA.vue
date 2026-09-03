<template>
  <main class="screen ai-screen">
    <header>
      <RouterLink to="/dashboard">‹</RouterLink>
      <div><small>ASSISTANT</small><b>Wedding+ IA</b></div>
      <span class="spark-mini">✦</span>
    </header>

    <section class="intro-card">
      <div class="spark">✦</div>
      <div>
        <p class="eyebrow">VOTRE ASSISTANT MARIAGE</p>
        <h2>Bonjour Glorie !</h2>
        <p>Je peux vous aider à organiser votre mariage à partir des données de la démo : budget, tâches, invités, prestataires et planning Jour J.</p>
      </div>
    </section>

    <section class="actions-grid">
      <button v-for="x in actions" :key="x.label" class="action" @click="runAction(x.key)">
        <span>{{x.icon}}</span>
        <div><strong>{{x.label}}</strong><small>{{x.help}}</small></div>
      </button>
    </section>

    <section class="chat-panel">
      <div class="messages" ref="messagesEl">
        <article v-for="m in messages" :key="m.id" :class="['message',m.role]">
          <span v-if="m.role==='assistant'" class="bot">✦</span>
          <div><small>{{m.role==='assistant'?'Wedding+ IA':'Vous'}}</small><p>{{m.text}}</p></div>
        </article>
      </div>
      <form class="composer" @submit.prevent="send">
        <input v-model="input" placeholder="Ex. Comment réduire mon budget ?" />
        <button type="submit">Envoyer</button>
      </form>
    </section>

    <Nav/>
  </main>
</template>

<script setup>
import { nextTick, ref } from 'vue';

const input=ref('');
const messagesEl=ref(null);
const messages=ref([
  {id:1,role:'assistant',text:'Je suis prête. Vous pouvez me demander d’optimiser votre budget, d’organiser vos tâches, de préparer le Jour J ou d’identifier les points à surveiller.'}
]);

const actions=[
  {key:'planning',icon:'◷',label:'Générer mon planning',help:'Priorités et prochaines étapes'},
  {key:'budget',icon:'€',label:'Optimiser mon budget',help:'Répartition et économies possibles'},
  {key:'tasks',icon:'✓',label:'Organiser mes tâches',help:'Ordre conseillé et urgences'},
  {key:'tables',icon:'♡',label:'Proposer un plan de table',help:'Méthode simple de répartition'},
  {key:'risks',icon:'!',label:'Identifier les risques',help:'Points à sécuriser avant le Jour J'},
  {key:'recommend',icon:'✦',label:'Recommandations',help:'Conseils adaptés à la préparation'}
];

function getStore(){
  try{return JSON.parse(localStorage.getItem('weddingPlusDemoStore')||'{}')}catch{return {}}
}
function euro(v){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v||0)}
function answer(kind, custom=''){
  const s=getStore();
  const tasks=s.tasks||[], guests=s.guests||[], vendors=s.vendors||[], budget=s.budget||[], wedding=(s.weddings||[])[0]||{};
  const pendingTasks=tasks.filter(t=>t.status!=='done');
  const spent=budget.reduce((a,x)=>a+Number(x.actual||0),0);
  const target=Number(wedding.budgetTarget||20000);
  const confirmed=guests.filter(g=>g.rsvp==='confirmed').length;
  const pendingGuests=guests.filter(g=>g.rsvp==='pending').length;
  const pendingVendors=vendors.filter(v=>!['booked','paid'].includes(v.status)).length;

  const key=kind||custom.toLowerCase();
  if(key==='budget'||key.includes('budget')||key.includes('économ')||key.includes('depense')||key.includes('dépense')){
    const remaining=target-spent;
    return `Votre budget cible est de ${euro(target)} et la démo recense environ ${euro(spent)} engagés, soit ${Math.round((spent/target)*100)} %. Il vous reste ${euro(remaining)} de marge. Je recommande de sécuriser d’abord le lieu et le traiteur, puis de plafonner les dépenses de décoration et d’animation tant que tous les prestataires essentiels ne sont pas confirmés.`;
  }
  if(key==='tasks'||key.includes('tâche')||key.includes('tache')||key.includes('priorit')){
    const first=pendingTasks.slice(0,3).map(t=>t.title).join(', ');
    return `Il reste ${pendingTasks.length} tâche(s) non terminée(s). Pour avancer efficacement, je placerais en priorité : ${first||'aucune tâche urgente actuellement'}. Commencez par les éléments qui dépendent d’un prestataire externe ou d’une date limite, puis traitez les tâches de confort et de décoration.`;
  }
  if(key==='planning'||key.includes('planning')||key.includes('jour j')||key.includes('calendrier')){
    return `Planning conseillé : 1) finaliser les prestataires encore en attente, 2) confirmer la liste d’invités, 3) verrouiller le budget final, 4) répartir les invités par table, puis 5) vérifier le déroulé du Jour J. Le jour du mariage, gardez une marge de 15 à 20 minutes entre les grandes étapes pour absorber les retards.`;
  }
  if(key==='tables'||key.includes('table')){
    return `Pour le plan de table, regroupez d’abord les invités par affinité : famille proche, amis, collègues. Évitez de séparer les couples, placez les personnes âgées loin des enceintes et gardez une ou deux places flexibles par table tant que toutes les réponses RSVP ne sont pas définitives. Dans la démo, ${confirmed} invité(s) sont déjà confirmés et ${pendingGuests} sont encore en attente.`;
  }
  if(key==='risks'||key.includes('risque')||key.includes('problème')||key.includes('probleme')){
    return `Les principaux risques visibles sont : ${pendingVendors} prestataire(s) encore non sécurisé(s), ${pendingGuests} réponse(s) invité(s) en attente et ${pendingTasks.length} tâche(s) non terminée(s). Je surveillerais en priorité les prestataires, puis les confirmations d’invités, car ces deux éléments peuvent modifier le budget et le plan de table.`;
  }
  if(key==='recommend'||key.includes('conseil')||key.includes('recommand')){
    return `Ma recommandation principale est de garder le tableau de bord comme point de contrôle quotidien : vérifiez les tâches urgentes, les RSVP, les dépenses et les prestataires non confirmés. Cela permet d’éviter les oublis et de détecter rapidement un retard dans l’organisation.`;
  }
  if(key.includes('invité')||key.includes('invite')){
    return `La démo compte ${guests.length} invité(s), dont ${confirmed} confirmé(s) et ${pendingGuests} en attente. Relancez d’abord les personnes en attente avant de figer le nombre de repas et le plan de table.`;
  }
  if(key.includes('prestataire')){
    return `Vous avez ${vendors.length} prestataire(s) enregistrés dans la démo, dont ${pendingVendors} encore à sécuriser. Vérifiez en priorité le contrat, l’acompte, l’horaire d’arrivée et un contact de secours pour chacun.`;
  }
  return `Je peux vous aider sur six sujets principaux : budget, tâches, invités, prestataires, plan de table et Jour J. Par exemple, demandez-moi « Quelles sont mes priorités ? » ou « Comment réduire mon budget ? ».`;
}

async function pushAssistant(text){
  messages.value.push({id:Date.now()+Math.random(),role:'assistant',text});
  await nextTick();
  messagesEl.value?.scrollTo({top:messagesEl.value.scrollHeight,behavior:'smooth'});
}
function runAction(key){
  messages.value.push({id:Date.now(),role:'user',text:actions.find(a=>a.key===key)?.label||key});
  setTimeout(()=>pushAssistant(answer(key)),180);
}
function send(){
  const text=input.value.trim(); if(!text)return;
  messages.value.push({id:Date.now(),role:'user',text});
  input.value='';
  setTimeout(()=>pushAssistant(answer('',text)),180);
}
</script>

<style scoped>
.ai-screen{padding-bottom:110px}header>div{display:grid;gap:2px}header small{font-size:10px;letter-spacing:.16em;color:var(--gold)}header b{font-family:Georgia,serif;font-size:22px}.spark-mini{color:var(--gold);font-size:21px}.intro-card{margin:16px 0;display:flex;gap:16px;align-items:flex-start;padding:22px;border-radius:24px;background:linear-gradient(135deg,#fff3f7,#fffaf0);border:1px solid #f0dfe5}.spark{width:52px;height:52px;border-radius:18px;background:#fff;display:grid;place-items:center;color:#c58a35;font-size:26px;box-shadow:0 8px 20px rgba(160,95,120,.1)}.eyebrow{margin:0 0 6px;font-size:10px;letter-spacing:.14em;color:#c58a35;font-weight:800}.intro-card h2{margin:0 0 6px;font-family:Georgia,serif;font-size:26px;color:#c91f60}.intro-card p:last-child{margin:0;color:#7f7076;line-height:1.6;font-size:13px;max-width:720px}.actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.action{min-height:92px!important;background:#fff!important;color:#2c2427!important;border:1px solid #f0e1e6!important;border-radius:20px!important;box-shadow:0 8px 22px rgba(108,55,73,.05)!important;text-align:left!important;display:flex!important;align-items:center!important;gap:12px!important;padding:15px!important}.action>span{width:40px;height:40px;border-radius:13px;background:#fff1f5;color:#c91f60;display:grid;place-items:center;font-size:18px;font-weight:800}.action div{display:grid;gap:4px}.action strong{font-size:13px}.action small{font-size:10px;color:#8c7e84;font-weight:500}.chat-panel{margin-top:16px;border:1px solid #f0e1e6;border-radius:24px;background:#fff;overflow:hidden;box-shadow:0 10px 28px rgba(108,55,73,.05)}.messages{height:290px;overflow:auto;padding:18px;display:grid;align-content:start;gap:12px;background:linear-gradient(180deg,#fff,#fffafd)}.message{display:flex;gap:9px;max-width:82%}.message.user{margin-left:auto;flex-direction:row-reverse}.message>div{padding:12px 14px;border-radius:16px;background:#fff1f5}.message.user>div{background:#c91f60;color:#fff}.message small{font-size:9px;font-weight:800;opacity:.7}.message p{margin:5px 0 0;font-size:12px;line-height:1.55;white-space:pre-line}.bot{width:30px;height:30px;border-radius:10px;background:#fff6e8;color:#c58a35;display:grid;place-items:center;flex:none}.composer{display:grid;grid-template-columns:1fr auto;gap:10px;padding:13px;border-top:1px solid #f1e5e9}.composer input{border:1px solid #eadde1;border-radius:14px;padding:12px 14px;background:#fff}.composer button{border-radius:14px;padding:0 18px}
@media(max-width:760px){.actions-grid{grid-template-columns:1fr 1fr}.intro-card{padding:18px}.messages{height:320px}.message{max-width:92%}}
@media(max-width:480px){.actions-grid{grid-template-columns:1fr}.action{min-height:76px!important}.composer{grid-template-columns:1fr}.composer button{height:42px}}
</style>