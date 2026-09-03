<template>
  <main class="screen page">
    <header><RouterLink to="/dashboard">‹</RouterLink><div><small>ORGANISATION</small><b>Mes tâches</b></div><button class="add" @click="showForm=!showForm">＋</button></header>
    <section v-if="showForm" class="form-card">
      <input v-model="form.title" placeholder="Nouvelle tâche" />
      <div class="form-row"><input v-model="form.dueDate" type="date"/><select v-model="form.priority"><option value="low">Basse</option><option value="medium">Moyenne</option><option value="high">Haute</option></select><button @click="addTask">Ajouter</button></div>
    </section>
    <div class="tabs"><button v-for="tab in tabs" :key="tab.key" :class="{active:filter===tab.key}" @click="filter=tab.key">{{tab.label}}</button></div>
    <p v-if="loading" class="state">Chargement…</p><p v-else-if="error" class="state error">{{error}}</p>
    <section v-else class="task-list">
      <article v-for="t in filtered" :key="t._id" class="task-row" :class="{done:t.status==='done'}">
        <button class="check" @click="toggle(t)">{{t.status==='done'?'✓':''}}</button>
        <div><strong>{{t.title}}</strong><small>{{formatDate(t.dueDate)}}</small><em :class="t.priority">Priorité {{priorityLabel(t.priority)}}</em></div>
        <button class="delete" @click="removeTask(t)">×</button>
      </article>
      <div v-if="!filtered.length" class="empty"><b>Tout est calme ✦</b><span>Aucune tâche dans cette catégorie.</span></div>
    </section>
    <Nav/>
  </main>
</template>
<script setup>
import { computed,onMounted,ref } from 'vue';
import { crudApi,getWeddingId } from '../services/api.js';
const service=crudApi('tasks'),tasks=ref([]),loading=ref(true),error=ref(''),filter=ref('all'),showForm=ref(false);const form=ref({title:'',dueDate:'',priority:'medium'});
const tabs=[{key:'all',label:'Toutes'},{key:'todo',label:'À faire'},{key:'in-progress',label:'En cours'},{key:'done',label:'Terminées'}];
const filtered=computed(()=>filter.value==='all'?tasks.value:tasks.value.filter(t=>t.status===filter.value));
function formatDate(v){return v?new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(v)):'Sans échéance'}
function priorityLabel(p){return p==='high'?'haute':p==='low'?'basse':'moyenne'}
async function load(){try{loading.value=true;const id=getWeddingId();if(!id)throw new Error('Aucun mariage actif');tasks.value=(await service.list(id)).data}catch(e){error.value=e.message}finally{loading.value=false}}
async function addTask(){if(!form.value.title.trim())return;const wedding=getWeddingId();const payload={wedding,title:form.value.title,dueDate:form.value.dueDate||undefined,priority:form.value.priority};const r=await service.create(payload);tasks.value.unshift(r.data);form.value={title:'',dueDate:'',priority:'medium'};showForm.value=false}
async function toggle(t){const status=t.status==='done'?'todo':'done';const r=await service.update(t._id,{status});Object.assign(t,r.data)}
async function removeTask(t){await service.remove(t._id);tasks.value=tasks.value.filter(x=>x._id!==t._id)}
onMounted(load);
</script>
<style scoped>
.page{padding-bottom:105px}header>div{display:grid;gap:2px}header small{font-size:10px;letter-spacing:.15em;color:var(--gold)}header b{font-family:Georgia,serif;font-size:22px}.add{font-size:20px}.form-card{background:#fff8fb;border:1px solid #f1dce4;padding:16px;border-radius:20px;margin:14px 0;display:grid;gap:10px}.form-row{display:grid;grid-template-columns:1fr 1fr auto;gap:8px}.form-card input,.form-card select{border:1px solid #eadde1;border-radius:12px;padding:11px;background:white}.tabs{display:flex;gap:8px;overflow:auto;margin:18px 0}.tabs button{background:#fff;border:1px solid #eadde1;color:#806d74;box-shadow:none;padding:9px 14px;border-radius:999px;white-space:nowrap}.tabs button.active{background:#c91f60;color:#fff;border-color:#c91f60}.task-list{display:grid;gap:10px}.task-row{display:grid;grid-template-columns:38px 1fr 34px;align-items:center;gap:13px;padding:16px;border:1px solid #f0e1e6;border-radius:18px;background:#fff}.task-row.done{opacity:.58}.task-row.done strong{text-decoration:line-through}.check{width:34px!important;min-width:34px!important;height:34px;padding:0!important;border-radius:50%!important;background:#fff!important;color:#c91f60!important;border:2px solid #e7a7bd!important;box-shadow:none!important}.task-row>div{display:grid;gap:5px}.task-row strong{font-size:14px}.task-row small{color:#8c7e84;font-size:11px}.task-row em{font-style:normal;font-size:10px;width:max-content;padding:5px 8px;border-radius:999px}.high{background:#ffe7ef;color:#b51d54}.medium{background:#fff5df;color:#9b6b20}.low{background:#eef9f1;color:#3e8656}.delete{background:transparent!important;color:#b99ca6!important;box-shadow:none!important;padding:0!important;font-size:22px}.state,.empty{text-align:center;padding:45px;color:#8c7e84}.error{color:#b51d54}.empty{display:grid;gap:6px;background:#fff9fb;border-radius:20px}.empty b{color:#c91f60}@media(max-width:600px){.form-row{grid-template-columns:1fr 1fr}.form-row button{grid-column:1/-1}}
</style>