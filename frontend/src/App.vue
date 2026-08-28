<template>
  <main v-if="showSplash" class="splash">
    <img class="splash-image" src="/assets/splash-wedding-plus.jpg" alt="Wedding+ splash screen" />
  </main>
  <RouterView v-else />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showSplash = ref(true)
let timer

onMounted(() => {
  timer = setTimeout(() => {
    showSplash.value = false
    router.push('/connexion')
  }, 2200)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style>
* { box-sizing: border-box; }
html, body, #app { margin: 0; width: 100%; min-height: 100%; }
body { background: #fff3f5; }
.splash {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #fff3f5;
}
.splash-image {
  display: block;
  width: min(100vw, 352px);
  height: 100vh;
  object-fit: cover;
  object-position: center;
}
@media (min-width: 600px) {
  .splash-image { width: auto; max-width: 100vw; }
}
</style>