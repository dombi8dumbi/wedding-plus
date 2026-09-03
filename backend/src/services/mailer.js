import nodemailer from "nodemailer";

function configured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendWelcomeEmail({ to, name }) {
  if (!configured()) {
    console.log("Wedding+ email skipped: SMTP_USER/SMTP_PASS not configured");
    return { sent: false, reason: "not-configured" };
  }
  const firstName = String(name || "").trim().split(/\s+/)[0] || "vous";
  const info = await transporter().sendMail({
    from: `Wedding+ <${process.env.SMTP_USER}>`,
    to,
    subject: "Bienvenue sur Wedding+ 💍",
    text: `Bonjour ${firstName},\n\nVotre compte Wedding+ a bien été créé. Vous pouvez maintenant configurer votre mariage et commencer votre organisation.\n\nÀ très bientôt sur Wedding+.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#35262c"><h2 style="color:#c91f60">Bienvenue sur Wedding+ 💍</h2><p>Bonjour <strong>${firstName}</strong>,</p><p>Votre compte Wedding+ a bien été créé.</p><p>Vous pouvez maintenant configurer votre mariage, votre budget, vos invités et votre planning dans votre espace personnel.</p><p style="margin-top:28px;color:#8c7e84">Wedding+ · Organisez · Planifiez · Vivez</p></div>`
  });
  return { sent: true, id: info.messageId };
}

export async function sendLoginEmail({ to, name }) {
  if (!configured()) {
    console.log("Wedding+ email skipped: SMTP_USER/SMTP_PASS not configured");
    return { sent: false, reason: "not-configured" };
  }
  const firstName = String(name || "").trim().split(/\s+/)[0] || "vous";
  const now = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris"
  }).format(new Date());
  const info = await transporter().sendMail({
    from: `Wedding+ <${process.env.SMTP_USER}>`,
    to,
    subject: "Connexion réussie à votre compte Wedding+",
    text: `Bonjour ${firstName},\n\nUne connexion à votre compte Wedding+ a été effectuée avec succès le ${now}.\n\nSi c'était bien vous, aucune action n'est nécessaire.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#35262c"><h2 style="color:#c91f60">Connexion réussie</h2><p>Bonjour <strong>${firstName}</strong>,</p><p>Une connexion à votre compte Wedding+ a été effectuée avec succès.</p><p><strong>${now}</strong></p><p>Si c'était bien vous, aucune action n'est nécessaire.</p><p style="margin-top:28px;color:#8c7e84">Wedding+ · Sécurité du compte</p></div>`
  });
  return { sent: true, id: info.messageId };
}
