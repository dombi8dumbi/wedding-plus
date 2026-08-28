<template>
  <main class="splash">
    <img class="splash-image" src="/assets/splash-wedding-plus.jpg" alt="Wedding+ splash screen" />
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
* { box-sizing: border-box; }

html, body, #app {
  margin: 0;
  width: 100%;
  min-height: 100%;
}

body {
  background: #fff3f5;
}

.splash {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #fff3f5;
}

.splash-image {
  display: block;
  width: min(100vw, 352px);
  height: auto;
  min-height: 100vh;
  object-fit: cover;
  object-position: center;
}

@media (min-width: 600px) {
  .splash-image {
    height: 100vh;
    width: auto;
    max-width: 100vw;
  }
}
</style>
