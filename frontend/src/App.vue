<template>
  <main v-if="showSplash" class="splash-wrap">
    <img class="splash-image" src="/assets/splash-wedding-plus.jpg" alt="Wedding+ splash screen" />
  </main>
  <RouterView v-else />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showSplash = ref(route.path === '/')
let timer

onMounted(() => {
  if (!showSplash.value) return
  timer = setTimeout(() => {
    showSplash.value = false
    router.replace('/connexion')
  }, 2200)
})

onBeforeUnmount(() => timer && clearTimeout(timer))
</script>

<style>
*{box-sizing:border-box}
html,body,#app{margin:0;min-width:100%;min-height:100%;}
body{background:#fff3f5;}
.splash-wrap{min-height:100vh;display:grid;place-items:center;background:#fff3f5;overflow:hidden}
.splash-image{display:block;width:352px;max-width:100vw;height:auto;max-height:100vh;object-fit:cover;border-radius:0}
@media(max-width:380px){.splash-image{width:100vw;height:100vh;object-fit:cover}}
</style>