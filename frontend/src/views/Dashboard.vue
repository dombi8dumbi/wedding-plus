<template>
  <main class="screen dashboard">
    <header class="topbar">
      <div class="brand-block">
        <div class="brand-mark">W<span>+</span></div>
        <div>
          <p class="eyebrow">WEDDING+</p>
          <h1>Bonjour Glorie 👋🏾</h1>
        </div>
      </div>
      <div class="top-actions">
        <button class="icon-btn" aria-label="Notifications">♡</button>
        <div class="avatar">G</div>
      </div>
    </header>

    <section class="hero-grid">
      <article class="countdown-card">
        <div>
          <span class="tag">Votre mariage</span>
          <h2>J-243</h2>
          <p>Samedi 12 avril 2026</p>
          <div class="place">Paris · Domaine de la Roseraie</div>
        </div>
        <div class="rings" aria-hidden="true">
          <span class="ring one"></span>
          <span class="ring two"></span>
          <i>✦</i>
        </div>
      </article>

      <article class="progress-card">
        <div class="card-heading">
          <div>
            <span class="tag muted-tag">Préparation</span>
            <h3>Progression globale</h3>
          </div>
          <strong>68%</strong>
        </div>
        <div class="progress"><span /></div>
        <p>Vous êtes sur la bonne voie. Plus que 8 tâches prioritaires ce mois-ci.</p>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel tasks-panel">
        <div class="section-title">
          <div>
            <span class="tag muted-tag">À faire</span>
            <h3>Prochaines tâches</h3>
          </div>
          <RouterLink to="/tasks">Voir tout</RouterLink>
        </div>

        <div class="task-list">
          <div class="task">
            <span class="task-dot urgent"></span>
            <div><strong>Confirmer le traiteur</strong><small>Avant le 18 septembre</small></div>
            <span class="status urgent-status">Prioritaire</span>
          </div>
          <div class="task">
            <span class="task-dot pink"></span>
            <div><strong>Envoyer les invitations</strong><small>120 invités</small></div>
            <span class="status">En cours</span>
          </div>
          <div class="task">
            <span class="task-dot gold"></span>
            <div><strong>Essai coiffure</strong><small>22 septembre · 14h30</small></div>
            <span class="status soft">Planifié</span>
          </div>
        </div>
      </article>

      <aside class="stats-column">
        <article class="mini-card">
          <div class="mini-icon">€</div>
          <div><span>Budget dépensé</span><strong>12 450 €</strong><small>sur 20 000 €</small></div>
          <b>62%</b>
        </article>
        <article class="mini-card">
          <div class="mini-icon people">♡</div>
          <div><span>Invités confirmés</span><strong>120</strong><small>sur 150 invités</small></div>
          <b>80%</b>
        </article>
        <article class="mini-card">
          <div class="mini-icon gold-icon">✓</div>
          <div><span>Prestataires</span><strong>8 / 10</strong><small>2 à confirmer</small></div>
          <b>80%</b>
        </article>
      </aside>
    </section>

    <section class="quick-actions">
      <RouterLink to="/invites"><span>＋</span><div><strong>Ajouter un invité</strong><small>Gérer les confirmations</small></div></RouterLink>
      <RouterLink to="/budget"><span>€</span><div><strong>Ajouter une dépense</strong><small>Suivre le budget</small></div></RouterLink>
      <RouterLink to="/prestataires"><span>☆</span><div><strong>Prestataires</strong><small>Voir les contacts</small></div></RouterLink>
      <RouterLink to="/ia"><span>✦</span><div><strong>Assistant Wedding+</strong><small>Besoin d'une idée ?</small></div></RouterLink>
    </section>

    <Nav />
  </main>
</template>

<style scoped>
.dashboard{background:linear-gradient(180deg,#fff 0%,#fffafc 100%)}
.topbar{margin-bottom:24px}.brand-block,.top-actions{display:flex;align-items:center}.brand-block{gap:14px}.brand-mark{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;font-family:Georgia,serif;font-size:28px;font-style:italic;color:#d82d6d;background:linear-gradient(145deg,#fff1f6,#fffaf2);border:1px solid #f3d8df;box-shadow:0 8px 18px rgba(181,73,109,.10)}.brand-mark span{color:#c48a39;font-style:normal;font-size:17px;margin-left:1px}.eyebrow{margin:0 0 2px;font-size:11px;letter-spacing:.18em;color:#c48a39;font-weight:800}.topbar h1{margin:0;font-size:22px;font-weight:750}.top-actions{gap:10px}.icon-btn{min-width:42px!important;padding:0!important;background:#fff!important;color:#d82d6d!important;border:1px solid #f1dce3!important;box-shadow:none!important;font-size:20px}.avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#e55286,#bf1f5b);font-weight:800;box-shadow:0 8px 18px rgba(201,31,96,.2)}
.hero-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:18px}.countdown-card,.progress-card,.panel,.mini-card,.quick-actions a{border:1px solid #f0dfe5;box-shadow:0 10px 30px rgba(108,55,73,.06)}.countdown-card{min-height:220px;border-radius:26px;padding:30px;background:linear-gradient(130deg,#fff5f7 0%,#fff 54%,#fff5e8 100%);display:flex;justify-content:space-between;align-items:center;overflow:hidden;position:relative}.countdown-card h2{font-family:Georgia,serif;font-size:68px;line-height:1;margin:10px 0 6px;color:#c91f60;font-weight:500}.countdown-card p{font-size:18px;margin:0 0 8px;font-weight:700}.place{font-size:13px;color:#8c7e84}.tag{display:inline-flex;align-items:center;padding:7px 11px;border-radius:999px;background:#fff;border:1px solid #f0d9df;color:#c91f60;font-size:11px;font-weight:800;letter-spacing:.03em}.muted-tag{background:#fff9fb;color:#9a7582}.rings{position:relative;width:190px;height:150px;flex:none}.ring{position:absolute;width:92px;height:92px;border:7px solid #c58a35;border-radius:50%;top:32px;box-shadow:inset 0 0 0 2px #f6dba8,0 8px 18px rgba(137,94,37,.12)}.ring.one{left:20px;transform:rotate(-10deg)}.ring.two{left:80px;top:44px;transform:rotate(8deg)}.rings i{position:absolute;right:18px;top:4px;color:#e9b858;font-size:32px;font-style:normal}.progress-card{border-radius:26px;padding:28px;background:#fff}.card-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.card-heading h3,.section-title h3{margin:10px 0 0;font-size:18px}.card-heading strong{font-family:Georgia,serif;font-size:38px;color:#c91f60;font-weight:500}.progress{height:12px;background:#f4e9ed;border-radius:999px;margin:28px 0 14px;overflow:hidden}.progress span{display:block;width:68%;height:100%;border-radius:999px;background:linear-gradient(90deg,#e84d83,#c91f60)}.progress-card p{color:#8c7e84;font-size:13px;line-height:1.6;margin:0}
.content-grid{display:grid;grid-template-columns:1.55fr .85fr;gap:18px;margin-top:18px}.panel{border-radius:26px;background:#fff;padding:24px}.section-title{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}.section-title a{color:#c91f60;text-decoration:none;font-size:13px;font-weight:700;padding-top:9px}.task-list{display:grid;gap:2px}.task{display:grid;grid-template-columns:14px 1fr auto;align-items:center;gap:12px;padding:15px 2px;border-bottom:1px solid #f4eaed}.task:last-child{border-bottom:0}.task-dot{width:11px;height:11px;border-radius:50%;background:#c58a35}.task-dot.urgent{background:#c91f60}.task-dot.pink{background:#ef91b2}.task div{display:grid;gap:4px}.task strong{font-size:14px}.task small{color:#8c7e84;font-size:12px}.status{font-size:11px;color:#9c6275;background:#fff1f5;padding:6px 9px;border-radius:999px}.urgent-status{color:#b01954;background:#ffe5ee}.soft{color:#95703d;background:#fff6e8}.stats-column{display:grid;gap:12px}.mini-card{min-height:94px;border-radius:22px;background:#fff;padding:17px;display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:13px}.mini-icon{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:#fff0f5;color:#c91f60;font-size:20px;font-weight:800}.mini-icon.people{color:#d9467c}.mini-icon.gold-icon{background:#fff6e9;color:#b87925}.mini-card div:nth-child(2){display:grid;gap:2px}.mini-card span,.mini-card small{font-size:11px;color:#8c7e84}.mini-card strong{font-size:18px}.mini-card b{font-size:13px;color:#c91f60}
.quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px}.quick-actions a{min-height:88px;border-radius:20px;background:#fff;text-decoration:none;color:#2b2226;padding:15px;display:flex;align-items:center;gap:12px}.quick-actions a>span{width:38px;height:38px;border-radius:13px;background:#fff1f5;color:#c91f60;display:grid;place-items:center;font-weight:800;font-size:18px}.quick-actions div{display:grid;gap:3px}.quick-actions strong{font-size:13px}.quick-actions small{font-size:10px;color:#8c7e84}
@media(max-width:900px){.hero-grid,.content-grid{grid-template-columns:1fr}.quick-actions{grid-template-columns:repeat(2,1fr)}.countdown-card{min-height:190px}.countdown-card h2{font-size:56px}.rings{width:150px;transform:scale(.85);transform-origin:right center}}
@media(max-width:600px){.topbar h1{font-size:18px}.brand-mark{width:42px;height:42px}.hero-grid{gap:12px}.countdown-card,.progress-card,.panel{border-radius:22px;padding:20px}.countdown-card{min-height:170px}.countdown-card h2{font-size:48px}.countdown-card p{font-size:15px}.rings{position:absolute;right:-22px;opacity:.42;transform:scale(.72)}.content-grid{margin-top:12px}.mini-card{min-height:82px}.quick-actions{grid-template-columns:1fr 1fr}.quick-actions a{min-height:82px;padding:12px}.quick-actions strong{font-size:12px}.task{grid-template-columns:12px 1fr}.task .status{display:none}}
</style>
