<template>
  <main class="auth-page">
    <section class="visual-panel">
      <div class="brand-lockup"><div class="brand-mark">W<span>+</span></div><div><b>WEDDING+</b><small>ORGANISEZ · PLANIFIEZ · VIVEZ</small></div></div>
      <div class="visual-copy">
        <span class="kicker">VOTRE MARIAGE, EN TOUTE SÉRÉNITÉ</span>
        <h1>Chaque détail compte.<br><em>Wedding+</em> les rassemble.</h1>
        <p>Budget, invités, prestataires, planning et Jour J réunis dans un seul espace élégant.</p>
      </div>
      <div class="rings" aria-hidden="true"><i></i><i></i><b>✦</b></div>
      <div class="quote">« Une organisation plus simple pour profiter pleinement de l'essentiel. »</div>
    </section>

    <section class="form-panel">
      <div class="mobile-brand"><div class="brand-mark">W<span>+</span></div><b>WEDDING+</b></div>
      <div class="auth-card">
        <span class="eyebrow">HEUREUSE DE VOUS REVOIR</span>
        <h2>Bienvenue sur Wedding+</h2>
        <p class="subtitle">Connectez-vous pour retrouver l'organisation de votre mariage.</p>

        <div class="tabs"><button class="active">Se connecter</button><RouterLink to="/inscription">Créer un compte</RouterLink></div>

        <form @submit.prevent="submit">
          <label>Adresse e-mail<input v-model="email" type="email" placeholder="glorie@email.com" required></label>
          <label>Mot de passe<div class="password"><input v-model="password" :type="showPassword?'text':'password'" placeholder="Votre mot de passe" required><button type="button" @click="showPassword=!showPassword">{{showPassword?'Masquer':'Afficher'}}</button></div></label>
          <div class="helper"><label class="remember"><input type="checkbox"> <span>Se souvenir de moi</span></label><a href="#" @click.prevent="error='En mode démo, utilisez simplement vos identifiants.'">Mot de passe oublié ?</a></div>
          <p v-if="error" class="error">{{ error }}</p>
          <button class="primary" :disabled="loading">{{ loading ? 'Connexion…' : 'Se connecter' }} <span>→</span></button>
        </form>

        <div class="separator"><span>ou</span></div>
        <button class="google" type="button" @click="googleDemo"><b>G</b> Continuer avec Google</button>
        <p class="bottom-link">Pas encore de compte ? <RouterLink to="/inscription">Créer un compte</RouterLink></p>
      </div>
      <small class="demo-note">Mode démonstration · Les données sont enregistrées localement</small>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, setSession } from '../services/api.js'
const router=useRouter(),email=ref('demo@weddingplus.fr'),password=ref('weddingplus'),error=ref(''),loading=ref(false),showPassword=ref(false)
async function connect(mail,pass){error.value='';loading.value=true;try{const response=await authApi.login(mail,pass);setSession(response.data);router.push('/dashboard')}catch(err){error.value=err.message}finally{loading.value=false}}
function submit(){connect(email.value,password.value)}
function googleDemo(){connect('google.demo@weddingplus.fr','demo-google')}
</script>

<style scoped>
.auth-page{min-height:100vh;display:grid;grid-template-columns:minmax(420px,1.05fr) minmax(480px,.95fr);background:#fff}.visual-panel{position:relative;overflow:hidden;padding:54px 64px;display:flex;flex-direction:column;color:#39272e;background:radial-gradient(circle at 85% 18%,rgba(215,163,78,.17),transparent 26%),radial-gradient(circle at 8% 78%,rgba(211,50,105,.13),transparent 32%),linear-gradient(145deg,#fff8fa,#fff3f5 52%,#fffaf0)}.brand-lockup{display:flex;align-items:center;gap:14px;z-index:2}.brand-lockup>div:last-child{display:grid;gap:4px}.brand-lockup b{font:700 15px Georgia,serif;letter-spacing:.17em;color:#bd255b}.brand-lockup small{font-size:9px;letter-spacing:.14em;color:#aa8350}.brand-mark{width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.86);border:1px solid rgba(207,108,139,.25);display:grid;place-items:center;font:italic 32px Georgia,serif;color:#ca2860;box-shadow:0 12px 30px rgba(142,66,94,.1)}.brand-mark span{color:#c28a3d;font:700 18px Arial;margin-left:1px}.visual-copy{max-width:650px;margin:auto 0;z-index:2}.kicker,.eyebrow{font-size:10px;font-weight:800;letter-spacing:.18em;color:#bd8950}.visual-copy h1{font:500 clamp(38px,4vw,68px)/1.08 Georgia,serif;margin:16px 0 20px}.visual-copy h1 em{font-weight:500;color:#c6235e}.visual-copy p{max-width:520px;font-size:15px;line-height:1.8;color:#806a73}.rings{position:absolute;width:430px;height:360px;right:-80px;bottom:80px;opacity:.18}.rings i{position:absolute;width:210px;height:210px;border:14px solid #b47b2e;border-radius:50%;bottom:10px}.rings i:first-child{left:20px}.rings i:nth-child(2){left:150px;bottom:48px}.rings b{position:absolute;right:68px;top:30px;color:#b47b2e;font-size:72px}.quote{z-index:2;font:italic 14px Georgia,serif;color:#8f6976}.form-panel{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px 7vw;background:#fff}.auth-card{width:min(100%,500px)}.auth-card h2{font:500 36px Georgia,serif;margin:9px 0 9px;color:#35262c}.subtitle{color:#8a7880;font-size:14px;line-height:1.6;margin:0 0 28px}.tabs{display:grid;grid-template-columns:1fr 1fr;background:#fff7fa;border:1px solid #f0dce3;padding:5px;border-radius:15px;margin-bottom:24px}.tabs>*{text-decoration:none;text-align:center;padding:11px;border:0;border-radius:11px;background:transparent;color:#8c7880;font-size:12px;font-weight:700}.tabs .active{background:#fff;color:#c5225e;box-shadow:0 5px 15px rgba(116,57,78,.08)}form{display:grid;gap:16px}label{display:grid;gap:8px;font-size:12px;font-weight:700;color:#58474e}input{width:100%;height:52px;border:1px solid #e9dce1;border-radius:14px;padding:0 15px;background:#fff;font-size:14px;outline:none;transition:.2s}input:focus{border-color:#d54b7d;box-shadow:0 0 0 4px rgba(213,75,125,.08)}.password{position:relative}.password button{position:absolute;right:10px;top:10px;height:32px;border:0;background:transparent;color:#bf2b61;font-size:11px;font-weight:700}.password input{padding-right:75px}.helper{display:flex;justify-content:space-between;align-items:center;font-size:11px}.helper a,.bottom-link a{color:#c5235e;text-decoration:none;font-weight:800}.remember{display:flex;grid-template-columns:auto 1fr;align-items:center;gap:6px;font-weight:500}.remember input{width:15px;height:15px}.primary{height:54px;border:0;border-radius:15px;background:linear-gradient(100deg,#e8477d,#c81f5e);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 12px 26px rgba(200,31,94,.2)}.primary span{font-size:19px}.primary:disabled{opacity:.6}.error{margin:0;padding:10px 12px;border-radius:11px;background:#fff1f4;color:#a62550;font-size:11px}.separator{display:flex;align-items:center;gap:12px;margin:22px 0;color:#ad9ca3;font-size:11px}.separator:before,.separator:after{content:'';height:1px;background:#eee2e6;flex:1}.google{width:100%;height:52px;border:1px solid #e9dce1;border-radius:14px;background:#fff;color:#42343a;font-weight:700}.google b{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;margin-right:8px;color:#4285f4;background:#f6f8ff}.bottom-link{text-align:center;font-size:12px;color:#88767d;margin-top:22px}.demo-note{margin-top:34px;color:#b6a7ad;font-size:10px}.mobile-brand{display:none}
@media(max-width:900px){.auth-page{grid-template-columns:1fr}.visual-panel{display:none}.form-panel{min-height:100vh;padding:32px 22px}.mobile-brand{display:flex;align-items:center;gap:10px;margin-bottom:32px}.mobile-brand .brand-mark{width:48px;height:48px}.mobile-brand b{font:700 14px Georgia,serif;letter-spacing:.15em;color:#bd255b}.auth-card h2{font-size:31px}}
</style>