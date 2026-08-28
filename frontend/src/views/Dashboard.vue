<template>
  <main class="dashboard">
    <header class="topbar">
      <div class="left">
        <span class="menu">☰</span>
        <span class="hello">Bonjour Glorie !</span>
      </div>
      <div class="profile">👩🏾</div>
    </header>

    <section class="day-card">
      <div><h1>JOUR J - 243</h1><p>Samedi 12 avril 2026</p></div>
      <div class="flowers">🌸</div>
    </section>

    <section class="progress-section">
      <div class="line-title"><span>Progression globale</span><strong>68%</strong></div>
      <div class="progress"><span></span></div>
    </section>

    <section class="tasks">
      <div class="section-title"><strong>Prochaines tâches</strong><RouterLink to="/tasks">Voir tout</RouterLink></div>
      <div class="task"><span class="circle"></span><span>Confirmer le traiteur</span><span class="empty"></span></div>
      <div class="task"><span class="circle pink"></span><span>Envoyer les invitations</span><span class="empty"></span></div>
      <div class="task"><span class="circle gold"></span><span>Essai coiffure</span><span class="empty"></span></div>
    </section>

    <section class="stats">
      <article><small>Budget</small><strong>12 450 €</strong><span>dépensés</span><b>♧</b></article>
      <article><small>Invités</small><strong>120</strong><span>confirmés</span><b>♧</b></article>
    </section>

    <nav class="bottom-nav">
      <RouterLink to="/dashboard" class="active"><i>⌂</i><span>Accueil</span></RouterLink>
      <RouterLink to="/mariage"><i>♡</i><span>Mariage</span></RouterLink>
      <RouterLink to="/tasks"><i>☑</i><span>Tâches</span></RouterLink>
      <RouterLink to="/budget"><i>▣</i><span>Budget</span></RouterLink>
      <RouterLink to="/ia"><i>•••</i><span>Plus</span></RouterLink>
    </nav>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}
.dashboard{width:min(100%,430px);min-height:100vh;margin:auto;background:#fff;padding:18px 14px 82px;font-family:Arial,sans-serif;color:#292325;border:1px solid #efd5d7;border-radius:20px;box-shadow:0 5px 25px rgba(80,40,45,.08)}
.topbar{height:38px;display:flex;align-items:center;justify-content:space-between}.left{display:flex;gap:20px;align-items:center}.menu{font-size:17px}.hello{font-size:12px}.profile{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#f8e1d8;font-size:16px}
.day-card{height:73px;margin-top:10px;border:1px solid #f2dddd;border-radius:11px;background:linear-gradient(90deg,#fff6f5,#fff1ee);padding:13px 15px;display:flex;justify-content:space-between;overflow:hidden}.day-card h1{font-size:17px;margin:0 0 5px;font-weight:500}.day-card p{font-size:10px;margin:0}.flowers{font-size:46px;line-height:40px;opacity:.65}
.progress-section{margin-top:18px}.line-title,.section-title{display:flex;justify-content:space-between;align-items:center}.line-title{font-size:10px}.line-title strong{font-size:11px}.progress{height:7px;background:#f2e8e8;border-radius:8px;margin-top:7px}.progress span{display:block;width:68%;height:100%;background:#ed4b81;border-radius:8px}
.tasks{margin-top:22px}.section-title{font-size:11px;margin-bottom:5px}.section-title a{color:#dc3d70;text-decoration:none;font-size:10px}.task{height:40px;border-bottom:1px solid #f1e9e9;display:flex;align-items:center;gap:10px;font-size:10px}.circle,.empty{width:12px;height:12px;border:1px solid #e9d6d8;border-radius:50%;flex:none}.circle.pink{border-color:#f3b7c9}.circle.gold{border-color:#efcf9d}.task .empty{margin-left:auto}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px}.stats article{position:relative;border:1px solid #f0e1e1;border-radius:10px;padding:11px 9px;height:63px;box-shadow:0 3px 12px rgba(100,50,60,.05)}.stats small,.stats span{display:block;font-size:8px;color:#555}.stats strong{display:block;font-size:12px;margin:5px 0 1px}.stats b{position:absolute;right:10px;top:22px;color:#ed4b81;font-size:22px;font-weight:400}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:min(100%,430px);height:64px;background:#fff;border-top:1px solid #f0e5e5;display:flex;justify-content:space-around;padding-top:8px}.bottom-nav a{width:20%;text-align:center;text-decoration:none;color:#9a8e91;font-size:8px}.bottom-nav i{display:block;font-style:normal;font-size:17px;line-height:24px}.bottom-nav .active{color:#ed3f78}.bottom-nav span{display:block}
</style>