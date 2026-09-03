<template>
  <main class="splash" @click="enter">
    <div class="orb orb-one"></div><div class="orb orb-two"></div>
    <section class="splash-content">
      <div class="logo-wrap">
        <div class="circle-line"></div>
        <div class="w-mark">W<span>+</span></div>
        <div class="rings"><i></i><i></i><b>✦</b></div>
      </div>
      <h1>WEDDING<span>+</span></h1>
      <p class="tagline">ORGANISEZ · PLANIFIEZ · VIVEZ</p>
      <div class="divider"><i></i><b>♡</b><i></i></div>
      <p class="promise">Votre mariage, en toute sérénité</p>
      <button @click.stop="enter">Commencer <span>→</span></button>
    </section>
    <small>Wedding+ · Démonstration</small>
  </main>
</template>
<script setup>
import {onMounted,onBeforeUnmount} from 'vue';import {useRouter} from 'vue-router';
const router=useRouter();let timer;
function enter(){clearTimeout(timer);router.push('/connexion')}
onMounted(()=>{timer=setTimeout(enter,2600)});onBeforeUnmount(()=>clearTimeout(timer));
</script>
<style scoped>
.splash{min-height:100vh;position:relative;overflow:hidden;display:grid;place-items:center;background:radial-gradient(circle at 50% 42%,#fff 0%,#fff9fa 42%,#fff3f6 72%,#fffaf0 100%);cursor:pointer;color:#402930}.splash:before{content:'';position:absolute;inset:28px;border:1px solid rgba(206,88,129,.13);border-radius:40px;pointer-events:none}.orb{position:absolute;border-radius:50%;filter:blur(5px);opacity:.45}.orb-one{width:440px;height:440px;background:rgba(215,57,112,.08);left:-170px;top:-140px}.orb-two{width:390px;height:390px;background:rgba(198,145,62,.1);right:-130px;bottom:-150px}.splash-content{text-align:center;z-index:2;animation:rise .75s ease both}.logo-wrap{width:240px;height:190px;margin:0 auto 8px;position:relative;display:grid;place-items:center}.circle-line{position:absolute;width:164px;height:164px;border:1px solid rgba(205,43,99,.42);border-radius:50%;transform:rotate(-18deg)}.circle-line:after{content:'';position:absolute;inset:9px -10px -7px 8px;border:1px solid rgba(191,136,56,.35);border-radius:50%;transform:rotate(25deg)}.w-mark{position:relative;z-index:2;font:italic 92px/.9 Georgia,serif;color:#cb245f;letter-spacing:-10px;text-shadow:0 10px 24px rgba(170,50,90,.08)}.w-mark span{font:700 34px Arial;color:#c18a3c;position:absolute;right:-22px;top:10px;letter-spacing:0}.rings{position:absolute;right:35px;bottom:22px;width:76px;height:52px}.rings i{position:absolute;width:34px;height:34px;border:4px solid #c79243;border-radius:50%;bottom:0}.rings i:first-child{left:5px}.rings i:nth-child(2){left:29px;bottom:7px}.rings b{position:absolute;right:2px;top:-7px;color:#d7a34d;font-size:18px}.splash h1{font:500 30px Georgia,serif;letter-spacing:.18em;color:#bd2359;margin:0}.splash h1 span{color:#bd873b}.tagline{margin:10px 0 16px;font-size:9px;font-weight:800;letter-spacing:.28em;color:#a47d4d}.divider{display:flex;align-items:center;justify-content:center;gap:10px;color:#c88d3e}.divider i{width:72px;height:1px;background:linear-gradient(90deg,transparent,#c88d3e)}.divider i:last-child{transform:scaleX(-1)}.divider b{font-weight:400;font-size:14px}.promise{font:italic 15px Georgia,serif;color:#80646e;margin:14px 0 26px}.splash button{border:0;border-radius:999px;padding:13px 24px;background:linear-gradient(100deg,#e64a7e,#c71f5d);color:#fff;font-size:12px;font-weight:800;box-shadow:0 12px 28px rgba(199,31,93,.22);cursor:pointer}.splash button span{margin-left:10px;font-size:16px}.splash>small{position:absolute;bottom:48px;color:#b49fa7;font-size:9px;letter-spacing:.12em;z-index:2}@keyframes rise{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}@media(max-width:600px){.splash:before{inset:14px;border-radius:28px}.logo-wrap{transform:scale(.88);margin-bottom:-4px}.splash h1{font-size:26px}.tagline{font-size:8px;letter-spacing:.2em}.splash>small{bottom:30px}}
</style>