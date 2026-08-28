<template>
  <main class="splash">
    <div class="soft-flower flower-a"></div>
    <div class="soft-flower flower-b"></div>
    <section class="content">
      <div class="rings">♢ ◯</div>
      <h1>Wedding<span>+</span></h1>
      <p class="tagline">PLAN • ORGANISE • PROFITE</p>
      <div class="heart">♡</div>
      <div class="loader"></div>
      <p class="loading">Préparation de votre expérience...</p>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  const timer = setTimeout(() => router.push('/connexion'), 2200)
  return () => clearTimeout(timer)
})
</script>

<style>
*{box-sizing:border-box}html,body,#app{margin:0;min-height:100%;width:100%}body{background:#f8e9ec}.splash{min-height:100vh;display:grid;place-items:center;overflow:hidden;position:relative;background:radial-gradient(circle at 50% 42%,#fff 0,#fff8f7 48%,#f8e5e9 100%);font-family:Arial,sans-serif;color:#a71f52}.content{text-align:center;z-index:2}.rings{font-size:58px;color:#b9792d;margin-bottom:12px}.splash h1{font:italic 500 58px Georgia,serif;margin:0;color:#c21f59}.splash h1 span{color:#bd7a2d}.tagline{font-size:14px;letter-spacing:.2em;color:#a96831;margin-top:22px}.heart{font-size:42px;color:#bd7a2d;margin:28px 0}.loader{width:62px;height:62px;border-radius:50%;border:6px solid #f2c5d0;border-top-color:#df2f72;margin:0 auto 18px;animation:spin 1.2s linear infinite}.loading{font-size:14px;color:#a71f52}.soft-flower{position:absolute;border-radius:50%;filter:blur(24px);opacity:.6}.flower-a{width:260px;height:260px;background:#f7b9c9;top:-100px;left:-80px}.flower-b{width:360px;height:360px;background:#f6d5dd;right:-120px;bottom:-80px}@keyframes spin{to{transform:rotate(360deg)}}
</style>