<template>
  <main class="screen">
    <section class="login-card">
      <div class="logo">Wedding<span>+</span></div>
      <h1>Bienvenue sur Wedding+</h1>
      <p class="subtitle">Organisez le mariage de vos rêves<br>en toute sérénité.</p>

      <div class="tabs">
        <button class="tab active">Se connecter</button>
        <RouterLink to="/inscription" class="tab">Créer un compte</RouterLink>
      </div>

      <form @submit.prevent="$router.push('/dashboard')">
        <input type="email" placeholder="Adresse e-mail" aria-label="Adresse e-mail">
        <div class="password">
          <input type="password" placeholder="Mot de passe" aria-label="Mot de passe">
          <span>◉</span>
        </div>
        <a href="#" class="forgot">Mot de passe oublié ?</a>
        <button class="primary">Se connecter</button>
      </form>

      <div class="separator"><span>ou continuer avec</span></div>

      <button class="google"><b>G</b> Continuer avec Google</button>

      <RouterLink to="/inscription" class="create">Créer un compte</RouterLink>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}
.screen{min-height:100vh;display:grid;place-items:center;padding:20px;background:#fbf0ed;font-family:Arial,sans-serif;color:#171214}
.login-card{width:min(100%,360px);background:#fff;border:1px solid #ead0d1;border-radius:22px;padding:30px 16px 24px;box-shadow:0 10px 35px rgba(112,47,61,.12)}
.logo{text-align:center;font:34px Georgia,serif;color:#c52b62;margin:2px 0 12px}.logo span{color:#bd7a2d}
h1{text-align:center;font-size:14px;margin:0 0 6px}.subtitle{text-align:center;font-size:10px;line-height:1.45;color:#51494b;margin:0 0 22px}
.tabs{display:flex;border-bottom:1px solid #f1d9de;margin-bottom:14px}.tab{flex:1;text-align:center;padding:9px 0;font-size:10px;color:#777;text-decoration:none;background:none;border:0}.tab.active{color:#dc2766;border-bottom:2px solid #ef4a82}
input{width:100%;height:36px;border:1px solid #eadcdf;border-radius:8px;padding:0 12px;font-size:10px;outline:none;background:#fff;margin-bottom:9px}.password{position:relative}.password input{margin-bottom:0}.password span{position:absolute;right:12px;top:11px;font-size:10px;color:#999}
.forgot{display:block;text-align:right;color:#df326b;font-size:9px;text-decoration:none;margin:11px 0 16px}
.primary,.google{width:100%;height:36px;border-radius:8px;font-size:10px;cursor:pointer}.primary{border:0;background:#ea3d75;color:#fff;font-weight:700}.separator{display:flex;align-items:center;gap:8px;margin:17px 0 10px;color:#aaa;font-size:9px}.separator:before,.separator:after{content:'';height:1px;background:#eee;flex:1}.google{border:1px solid #eadcdf;background:#fff;color:#333}.google b{color:#4285f4;margin-right:8px;font-size:14px}.create{display:block;text-align:center;margin-top:22px;color:#df326b;font-size:10px;text-decoration:none}
@media(min-width:600px){.login-card{width:360px}}
</style>