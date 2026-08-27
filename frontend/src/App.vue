<template>
  <main class="app">
    <section class="hero">
      <p class="eyebrow">Wedding +</p>
      <h1>Organisez votre mariage, simplement.</h1>
      <p>Une plateforme pour centraliser le planning, le budget, les prestataires et le Jour J.</p>
      <button>Commencer</button>
    </section>
  </main>
</template>

<style>
:root { font-family: Inter, system-ui, sans-serif; color: #24202a; background: #faf8f6; }
* { box-sizing: border-box; }
body { margin: 0; }
.app { min-height: 100vh; display: grid; place-items: center; padding: 32px; }
.hero { max-width: 720px; text-align: center; }
.eyebrow { letter-spacing: .15em; text-transform: uppercase; font-weight: 700; }
h1 { font-size: clamp(2.5rem, 7vw, 5rem); line-height: 1; margin: 16px 0; }
p { line-height: 1.6; }
button { border: 0; border-radius: 999px; padding: 14px 24px; font-weight: 700; cursor: pointer; }
</style>