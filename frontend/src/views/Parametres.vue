<template>
  <main class="screen settings-screen">
    <header class="page-header">
      <RouterLink to="/dashboard" class="back">‹</RouterLink>
      <div><small>WEDDING+</small><b>Paramètres</b></div>
      <span></span>
    </header>

    <section class="profile-card">
      <div class="avatar">{{ initials }}</div>
      <div>
        <p class="eyebrow">MON COMPTE</p>
        <h1>{{ user?.name || 'Glorie' }}</h1>
        <p>{{ user?.email || 'demo@weddingplus.fr' }}</p>
      </div>
      <button class="edit" @click="editing=!editing">{{ editing ? 'Fermer' : 'Modifier' }}</button>
    </section>

    <section v-if="editing" class="settings-card edit-card">
      <h2>Informations personnelles</h2>
      <label>Nom affiché<input v-model="displayName" type="text"></label>
      <button class="save" @click="saveProfile">Enregistrer</button>
      <p v-if="saved" class="saved">✓ Modifications enregistrées pour la démonstration.</p>
    </section>

    <div class="settings-grid">
      <section class="settings-card">
        <div class="section-title"><span>♡</span><div><h2>Mon mariage</h2><p>Accès rapide aux informations principales</p></div></div>
        <RouterLink class="row" to="/mariage"><div><strong>Informations du mariage</strong><small>Date, lieu et couple</small></div><b>›</b></RouterLink>
        <RouterLink class="row" to="/plan-table"><div><strong>Plan de table</strong><small>Placement des invités</small></div><b>›</b></RouterLink>
        <RouterLink class="row" to="/prestataires"><div><strong>Prestataires</strong><small>Suivi des réservations</small></div><b>›</b></RouterLink>
      </section>

      <section class="settings-card">
        <div class="section-title"><span>◉</span><div><h2>Notifications</h2><p>Choisissez les rappels que vous souhaitez recevoir</p></div></div>
        <div class="row"><div><strong>Alertes importantes</strong><small>Retards, budget et prestataires</small></div><button class="switch" :class="{on:prefs.alerts}" @click="toggle('alerts')"><i></i></button></div>
        <div class="row"><div><strong>Rappels de tâches</strong><small>Échéances à venir</small></div><button class="switch" :class="{on:prefs.tasks}" @click="toggle('tasks')"><i></i></button></div>
        <div class="row"><div><strong>Conseils Wedding+ IA</strong><small>Suggestions d'organisation</small></div><button class="switch" :class="{on:prefs.ai}" @click="toggle('ai')"><i></i></button></div>
        <RouterLink class="row" to="/alertes"><div><strong>Centre d'alertes</strong><small>Voir toutes les notifications</small></div><b>›</b></RouterLink>
      </section>

      <section class="settings-card">
        <div class="section-title"><span>✦</span><div><h2>Assistant & préférences</h2><p>Personnalisez votre expérience Wedding+</p></div></div>
        <RouterLink class="row" to="/ia"><div><strong>Wedding+ IA</strong><small>Planning, budget et recommandations</small></div><b>›</b></RouterLink>
        <div class="row"><div><strong>Mode Jour J</strong><small>Afficher les rappels prioritaires</small></div><button class="switch" :class="{on:prefs.dayMode}" @click="toggle('dayMode')"><i></i></button></div>
        <div class="row static"><div><strong>Langue</strong><small>Français</small></div><span>FR</span></div>
      </section>

      <section class="settings-card">
        <div class="section-title"><span>⌁</span><div><h2>Données & sécurité</h2><p>Gestion de la session et des données</p></div></div>
        <div class="row static"><div><strong>Stockage</strong><small>Backend Express + base JSON de démonstration</small></div><span class="status">Actif</span></div>
        <div class="row static"><div><strong>Session sécurisée</strong><small>Authentification par token JWT</small></div><span class="status">JWT</span></div>
        <button class="row full-row" @click="copyApi"><div><strong>Adresse de l'API</strong><small>http://localhost:5000/api</small></div><b>{{ copied ? '✓' : 'Copier' }}</b></button>
      </section>
    </div>

    <section class="danger-zone">
      <div><strong>Se déconnecter</strong><p>Vous pourrez vous reconnecter avec le même compte.</p></div>
      <button class="logout" @click="logout">Déconnexion</button>
    </section>

    <p class="version">Wedding+ · Version démonstration 1.0</p>
    <Nav/>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearSession, getCurrentUser } from '../services/api.js'

const router = useRouter()
const user = ref(getCurrentUser())
const editing = ref(false)
const saved = ref(false)
const copied = ref(false)
const displayName = ref(user.value?.name || '')
const defaults = {alerts:true,tasks:true,ai:true,dayMode:true}
let stored = {}
try{ stored = JSON.parse(localStorage.getItem('weddingPlusPreferences') || '{}') }catch{}
const prefs = reactive({...defaults,...stored})
const initials = computed(()=>String(user.value?.name || 'G').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())
function persist(){ localStorage.setItem('weddingPlusPreferences',JSON.stringify(prefs)) }
function toggle(key){ prefs[key]=!prefs[key]; persist() }
function saveProfile(){
  const clean=displayName.value.trim(); if(!clean)return
  user.value={...(user.value||{}),name:clean}
  localStorage.setItem('weddingPlusUser',JSON.stringify(user.value)); saved.value=true
  setTimeout(()=>saved.value=false,1800)
}
async function copyApi(){ try{await navigator.clipboard.writeText('http://localhost:5000/api')}catch{} copied.value=true;setTimeout(()=>copied.value=false,1500) }
function logout(){ clearSession(); router.replace('/connexion') }
</script>

<style scoped>
.settings-screen{padding-bottom:118px;max-width:1120px;margin:auto}.page-header{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;padding:8px 0 18px}.page-header>div{text-align:center;display:grid;gap:2px}.page-header small{font-size:10px;letter-spacing:.15em;color:#b98538;font-weight:800}.page-header b{font:700 22px Georgia,serif}.back{width:40px;height:40px;border-radius:14px;display:grid;place-items:center;text-decoration:none;color:#c91f60;background:#fff;border:1px solid #f0e0e5;font-size:24px}.profile-card{display:grid;grid-template-columns:64px 1fr auto;gap:16px;align-items:center;padding:22px 24px;border-radius:26px;background:linear-gradient(135deg,#fff0f5,#fffaf0);border:1px solid #f0dce3}.avatar{width:62px;height:62px;border-radius:20px;background:#c91f60;color:#fff;display:grid;place-items:center;font:700 22px Georgia,serif;box-shadow:0 9px 24px rgba(201,31,96,.18)}.eyebrow{margin:0 0 3px!important;font-size:9px!important;letter-spacing:.14em;color:#b98538!important;font-weight:800}.profile-card h1{margin:0;font:700 24px Georgia,serif;color:#32272b}.profile-card p:last-child{margin:4px 0 0;font-size:11px;color:#82747a}.edit{width:auto!important;padding:9px 14px!important;border-radius:999px!important;background:#fff!important;color:#c91f60!important;border:1px solid #e8cbd5!important;font-size:10px!important}.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.settings-card{padding:18px;border-radius:22px;background:#fff;border:1px solid #eee1e5;box-shadow:0 8px 24px rgba(95,52,69,.04)}.section-title{display:flex;gap:11px;align-items:center;padding-bottom:12px}.section-title>span{width:38px;height:38px;border-radius:13px;background:#fff2f6;color:#c91f60;display:grid;place-items:center;font-weight:800}.section-title h2{font:700 16px Georgia,serif;margin:0}.section-title p{margin:3px 0 0;font-size:9px;color:#978990}.row{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #f3e9ec;text-decoration:none;color:inherit;background:none!important;width:100%!important;padding:10px 2px!important;border-radius:0!important;box-shadow:none!important;text-align:left!important}.row div{display:grid;gap:4px}.row strong{font-size:11px;color:#3b3034}.row small{font-size:9px;color:#96888e}.row>b{color:#c91f60;font-size:16px}.row.static span{font-size:9px;color:#9b8d93}.status{padding:4px 8px;border-radius:999px;background:#fff2f6;color:#c91f60!important;font-weight:800}.switch{width:38px!important;height:22px!important;min-height:0!important;padding:2px!important;border-radius:999px!important;background:#ddd1d5!important;border:0!important;box-shadow:none!important;flex:none}.switch i{display:block;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s}.switch.on{background:#c91f60!important}.switch.on i{transform:translateX(16px)}.edit-card{margin-top:14px}.edit-card h2{font:700 16px Georgia,serif}.edit-card label{display:grid;gap:6px;font-size:10px;color:#74666c}.edit-card input{height:42px;border:1px solid #e5d7dc;border-radius:12px;padding:0 12px}.save{margin-top:10px!important;width:auto!important;padding:10px 15px!important;border-radius:12px!important}.saved{font-size:9px;color:#37805a}.danger-zone{margin-top:14px;padding:18px 20px;border:1px solid #f0d5dd;background:#fff8fa;border-radius:22px;display:flex;align-items:center;justify-content:space-between;gap:16px}.danger-zone strong{font-size:12px;color:#a32650}.danger-zone p{margin:4px 0 0;font-size:9px;color:#947e86}.logout{width:auto!important;padding:10px 16px!important;border-radius:12px!important;background:#fff!important;color:#c91f60!important;border:1px solid #c91f60!important;font-size:10px!important}.version{text-align:center;margin:18px 0 0;font-size:9px;color:#ad9fa4}@media(max-width:760px){.settings-grid{grid-template-columns:1fr}.profile-card{grid-template-columns:52px 1fr auto;padding:18px}.avatar{width:50px;height:50px}.profile-card h1{font-size:20px}.danger-zone{align-items:flex-start;flex-direction:column}.logout{width:100%!important}.page-header b{font-size:19px}}
</style>