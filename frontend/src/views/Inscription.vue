<template>
  <main class="screen register-screen">
    <section class="card">
      <div class="brand"><div class="ring">♧</div><div class="logo">Wedding<span>+</span></div></div>
      <h1>Créer un compte</h1>
      <p>Organisez le mariage de vos rêves<br>en toute sérénité.</p>
      <form @submit.prevent="submit">
        <input v-model="name" type="text" placeholder="Nom complet" required>
        <input v-model="email" type="email" placeholder="Adresse e-mail" required>
        <input v-model="password" type="password" placeholder="Mot de passe" minlength="6" required>
        <p v-if="error" class="error">{{ error }}</p>
        <button :disabled="loading">{{ loading ? 'Création…' : 'Créer mon compte' }}</button>
      </form>
      <div class="separator"><span>ou continuer avec</span></div>
      <button class="google" type="button">G　Continuer avec Google</button>
      <RouterLink to="/connexion">Déjà un compte ? Se connecter</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, setSession } from '../services/api.js'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const response = await authApi.register(name.value, email.value, password.value)
    setSession(response.data)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-screen{padding:12px 10px 10px;background:#fff}.card{height:100%;padding:20px 2px 8px;text-align:center}.brand{margin-bottom:8px}.ring{height:15px;color:#d49a45;font-size:19px;line-height:15px;transform:rotate(180deg)}.logo{font:27px Georgia,serif;color:#c32f61}.logo span{color:#d49a45}h1{font-size:10px;margin:10px 0 4px}p{font-size:7px;line-height:1.35;margin:0 0 15px}input{width:100%;height:31px;border:1px solid #eadcdf;border-radius:7px;padding:0 9px;font-size:7px;margin-bottom:8px}button{width:100%;height:30px;border:0;border-radius:6px;background:#ec3f77;color:#fff;font-size:7px}button:disabled{opacity:.65}.error{color:#b42318;font-size:6.5px;margin:-2px 0 8px}.separator{display:flex;align-items:center;gap:7px;margin:12px 0 8px;color:#aaa;font-size:6px}.separator:before,.separator:after{content:'';height:1px;background:#eee;flex:1}.google{border:1px solid #eadcdf;background:#fff;color:#333}.card>a{display:block;text-align:center;margin-top:18px;color:#df326b;font-size:6.5px;text-decoration:none}
</style>