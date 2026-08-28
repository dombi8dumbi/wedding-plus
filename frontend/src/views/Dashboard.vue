<template>
<main class="screen dashboard">
<header><div class="left"><span class="menu">☰</span><span>Bonjour Glorie !</span></div><div class="avatar">👩🏾</div></header>
<section class="day-card"><div><h1>JOUR J - 243</h1><p>Samedi 12 avril 2026</p></div><div class="floral">🌸</div></section>
<section class="progress-section"><div class="line-title"><span>Progression globale</span><strong>68%</strong></div><div class="progress"><span/></div></section>
<section class="tasks"><div class="section-title"><b>Prochaines tâches</b><RouterLink to="/tasks">Voir tout</RouterLink></div>
<div class="task"><i/> <span>Confirmer le traiteur</span><i class="check"/></div>
<div class="task"><i class="pink"/> <span>Envoyer les invitations</span><i class="check"/></div>
<div class="task"><i class="gold"/> <span>Essai coiffure</span><i class="check"/></div></section>
<section class="stats"><article><small>Budget</small><strong>12 450 €</strong><span>dépensés</span><b>♧</b></article><article><small>Invités</small><strong>120</strong><span>confirmés</span><b>♧</b></article></section>
<Nav/>
</main>
</template>
<style scoped>
.dashboard{padding-top:16px}.left{display:flex;align-items:center;gap:20px;font-size:12px}.menu{font-size:16px}.avatar{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#f7e0d9;font-size:15px}
.day-card{height:73px;margin-top:10px;border:1px solid #f2dddd;border-radius:11px;background:linear-gradient(90deg,#fff7f6,#fff0ee);padding:13px 15px;display:flex;justify-content:space-between;overflow:hidden}.day-card h1{font-size:17px;margin:0 0 5px;font-weight:500}.day-card p{font-size:10px;margin:0}.floral{font-size:45px;line-height:40px;opacity:.7;margin-top:-3px}
.progress-section{margin-top:18px}.line-title,.section-title{display:flex;justify-content:space-between;align-items:center}.line-title{font-size:10px}.line-title strong{font-size:10px}.progress{height:7px;background:#f2e8e8;border-radius:8px;margin-top:7px}.progress span{display:block;width:68%;height:100%;background:#ed4b81;border-radius:8px}
.tasks{margin-top:22px}.section-title{font-size:11px;margin-bottom:4px}.section-title a{color:#dc3d70;text-decoration:none;font-size:10px}.task{height:40px;border-bottom:1px solid #f1e9e9;display:flex;align-items:center;gap:10px;font-size:10px}.task i{width:12px;height:12px;border:1px solid #e9d6d8;border-radius:50%;flex:none}.task i.pink{border-color:#f3b7c9}.task i.gold{border-color:#efcf9d}.task .check{margin-left:auto}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px}.stats article{position:relative;border:1px solid #f0e1e1;border-radius:10px;padding:10px 9px;height:63px;box-shadow:0 3px 12px rgba(100,50,60,.05)}.stats small,.stats span{display:block;font-size:8px;color:#555}.stats strong{display:block;font-size:12px;margin:5px 0 1px}.stats b{position:absolute;right:10px;top:20px;color:#ed4b81;font-size:22px;font-weight:400}
</style>