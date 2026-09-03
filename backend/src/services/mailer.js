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

function fmtDate(value) {
  if (!value) return "date à confirmer";
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(value));
  } catch {
    return "date à confirmer";
  }
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

export async function sendGuestInvitationEmail({ to, guestName, wedding, responseUrl }) {
  if (!configured()) return { sent:false, reason:"not-configured" };
  const couple = `${wedding?.partner1 || ""} & ${wedding?.partner2 || ""}`.trim();
  const date = fmtDate(wedding?.date);
  const place = wedding?.location || "lieu à confirmer";
  const info = await transporter().sendMail({
    from: `Wedding+ <${process.env.SMTP_USER}>`,
    to,
    subject: `Invitation au mariage de ${couple}`,
    text: `Bonjour ${guestName},\n\n${couple} ont le plaisir de vous inviter à leur mariage le ${date}, à ${place}.\n\nMerci de confirmer votre présence ici : ${responseUrl}\n\nWedding+`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#35262c"><div style="padding:28px;border:1px solid #f0dce3;border-radius:18px"><p style="letter-spacing:.15em;color:#b7833c;font-size:11px">WEDDING+</p><h2 style="font-family:Georgia,serif;color:#c91f60">Vous êtes invité(e) 💍</h2><p>Bonjour <strong>${guestName}</strong>,</p><p><strong>${couple}</strong> ont le plaisir de vous inviter à célébrer leur mariage.</p><p><strong>${date}</strong><br>${place}</p><p style="margin:28px 0"><a href="${responseUrl}" style="background:#c91f60;color:white;text-decoration:none;padding:13px 20px;border-radius:12px;font-weight:bold">Répondre à l'invitation</a></p><p style="font-size:12px;color:#8c7e84">Vous pourrez accepter ou refuser l'invitation. En cas de refus, Wedding+ vous proposera d'indiquer votre motif.</p></div></div>`
  });
  return { sent:true, id:info.messageId };
}

export async function sendGuestReminderEmail({ to, guestName, wedding, responseUrl }) {
  if (!configured()) return { sent:false, reason:"not-configured" };
  const couple = `${wedding?.partner1 || ""} & ${wedding?.partner2 || ""}`.trim();
  const info = await transporter().sendMail({
    from: `Wedding+ <${process.env.SMTP_USER}>`,
    to,
    subject: `Petit rappel — invitation au mariage de ${couple}`,
    text: `Bonjour ${guestName},\n\nVotre réponse à l'invitation de ${couple} est toujours en attente. Vous pouvez répondre ici : ${responseUrl}\n\nWedding+`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#35262c"><h2 style="color:#c91f60">Petit rappel 💌</h2><p>Bonjour <strong>${guestName}</strong>,</p><p>Votre réponse à l'invitation de <strong>${couple}</strong> est toujours en attente.</p><p><a href="${responseUrl}" style="background:#c91f60;color:white;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:bold">Répondre maintenant</a></p><p style="color:#8c7e84;font-size:12px">Merci de nous aider à finaliser l'organisation.</p></div>`
  });
  return { sent:true, id:info.messageId };
}
