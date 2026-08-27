<template>
  <main class="splash">
    <div class="glow glow-one"></div><div class="glow glow-two"></div>
    <div class="floral floral-one">✿</div><div class="floral floral-two">✦</div>
    <section class="content">
      <div class="logo-mark" aria-label="Wedding+">W<span>+</span></div>
      <h1>Wedding<span>+</span></h1>
      <p class="tagline">Votre mariage, votre histoire.</p>
      <div class="loader" aria-label="Chargement"><span></span></div>
      <p class="loading">Préparation de votre grand jour<span class="dots">...</span></p>
    </section>
    <footer>Organisez • Planifiez • Vivez</footer>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => setTimeout(() => router.push('/connexion'), 2200))
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;1,500&display=swap');
*{box-sizing:border-box}.splash{min-height:100vh;position:relative;overflow:hidden;display:grid;place-items:center;background:radial-gradient(circle at 50% 42%,#fff 0,#fff8f7 48%,#fceef1 100%);color:#4a343c;font-family:'DM Sans',sans-serif}.content{text-align:center;position:relative;z-index:2;animation:appear 1s ease both}.logo-mark{margin:auto;width:108px;height:108px;border:1px solid #d6a15c;border-radius:50%;display:grid;place-items:center;font:500 58px 'Playfair Display',serif;color:#bd2e64;background:#fff9f5;box-shadow:0 12px 45px #c98a2e22}.logo-mark span{color:#c98a2e;font-size:31px;margin-left:-8px;margin-top:-28px}.splash h1{font:italic 500 56px 'Playfair Display',serif;margin:25px 0 4px;color:#bd2e64;letter-spacing:-1px}.splash h1 span{color:#c98a2e;font-style:normal}.tagline{font-size:15px;letter-spacing:.08em;color:#9a7b82;margin:0}.loader{width:150px;height:3px;background:#f0dce1;border-radius:9px;margin:48px auto 14px;overflow:hidden}.loader span{display:block;width:45%;height:100%;background:#d89548;border-radius:9px;animation:load 2.1s ease-in-out forwards}.loading{font-size:12px;color:#aa8c93}.dots{display:inline-block;width:18px;overflow:hidden;animation:dots 1s steps(4,end) infinite}.floral{position:absolute;color:#d69b51;opacity:.45;font-size:42px}.floral-one{top:15%;left:12%;transform:rotate(-20deg)}.floral-two{bottom:18%;right:14%;font-size:32px}.glow{position:absolute;border-radius:50%;filter:blur(2px);opacity:.5}.glow-one{width:360px;height:360px;background:#f7cbd7;top:-180px;right:-120px}.glow-two{width:280px;height:280px;background:#f6dfbd;bottom:-150px;left:-100px}.splash footer{position:absolute;bottom:28px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#b18e96}@keyframes appear{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}@keyframes load{from{transform:translateX(-120%)}to{transform:translateX(235%)}}@keyframes dots{0%,20%{width:4px}50%{width:10px}80%,100%{width:18px}}@media(max-width:600px){.splash h1{font-size:48px}.logo-mark{width:94px;height:94px}.floral-one{left:7%}.floral-two{right:7%}}
</style>