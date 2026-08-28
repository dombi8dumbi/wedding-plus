<template>
  <main class="screen login-screen">
    <section class="login-card">
      <div class="brand">
        <div class="ring-mark">♧</div>
        <div class="logo">Wedding<span>+</span></div>
      </div>
      <h1>Bienvenue sur Wedding+</h1>
      <p class="subtitle">Organisez le mariage de vos rêves<br>en toute sérénité.</p>
      <div class="tabs"><button class="tab active">Se connecter</button><RouterLink to="/inscription" class="tab">Créer un compte</RouterLink></div>
      <form @submit.prevent="$router.push('/dashboard')">
        <input type="email" placeholder="Adresse e-mail">
        <div class="password"><input type="password" placeholder="Mot de passe"><span>◉</span></div>
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
.login-screen{padding:12px 10px 10px;background:#fff}.login-card{height:100%;display:flex;flex-direction:column;padding:20px 2px 6px;background:#fff}.brand{text-align:center;margin-bottom:8px}.ring-mark{height:15px;color:#d49a45;font-size:19px;line-height:15px;transform:rotate(180deg)}.logo{font:27px Georgia,serif;color:#c32f61;line-height:1}.logo span{color:#d49a45}h1{text-align:center;font-size:10px;margin:10px 0 4px}.subtitle{text-align:center;font-size:7px;line-height:1.35;margin:0 0 14px}.tabs{display:flex;border-bottom:1px solid #f2dce1;margin-bottom:11px}.tab{flex:1;text-align:center;padding:8px 0;font-size:7px;color:#777;text-decoration:none;background:none;border:0}.tab.active{color:#df2e68;border-bottom:2px solid #ef4a80}input{width:100%;height:31px;border:1px solid #eadcdf;border-radius:7px;padding:0 9px;font-size:7px;background:#fff;margin-bottom:8px}.password{position:relative}.password input{margin-bottom:0}.password span{position:absolute;right:9px;top:10px;color:#999;font-size:7px}.forgot{display:block;text-align:right;color:#df326b;font-size:6.5px;text-decoration:none;margin:8px 0 11px}.primary,.google{width:100%;height:30px;border-radius:6px;font-size:7px}.primary{border:0;background:linear-gradient(90deg,#ed4077,#ec3f77);color:#fff}.separator{display:flex;align-items:center;gap:7px;margin:11px 0 8px;color:#aaa;font-size:6px}.separator:before,.separator:after{content:'';height:1px;background:#eee;flex:1}.google{border:1px solid #eadcdf;background:#fff;color:#333}.google b{color:#4285f4;margin-right:7px;font-size:11px}.create{display:block;text-align:center;margin-top:14px;color:#df326b;font-size:6.5px;text-decoration:none}
</style>