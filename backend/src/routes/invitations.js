import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { sendGuestInvitationEmail, sendGuestReminderEmail } from "../services/mailer.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../data/db.json");

function readDB(){ return JSON.parse(fs.readFileSync(dbPath,"utf8")); }
function writeDB(db){ fs.writeFileSync(dbPath,JSON.stringify(db,null,2),"utf8"); }
function guestName(g){ return `${g?.firstName||""} ${g?.lastName||""}`.trim() || "cher invité"; }
function baseUrl(){ return String(process.env.CLIENT_URL || "https://weddingplus.vercel.app").replace(/\/$/,""); }
function responseUrl(token){ return `${baseUrl()}/invitation/${token}`; }
function normalizePhone(value){ return String(value||"").replace(/[^0-9]/g,""); }
function whatsappUrl(guest,wedding,token){
  const phone=normalizePhone(guest.phone);
  if(!phone) return null;
  const couple=`${wedding.partner1||""} & ${wedding.partner2||""}`.trim();
  const text=`Bonjour ${guest.firstName||""} 💍\n${couple} ont le plaisir de vous inviter à leur mariage. Merci de confirmer votre présence ici : ${responseUrl(token)}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
async function safely(fn,payload){
  try{return await fn(payload);}catch(error){console.error("Wedding+ invitation email error:",error.message);return {sent:false,reason:error.message};}
}

router.post("/invitations/:guestId/send", async (req,res)=>{
  const db=readDB();
  const guest=(db.guests||[]).find(g=>g._id===req.params.guestId);
  if(!guest) return res.status(404).json({success:false,message:"Invité introuvable"});
  const wedding=(db.weddings||[]).find(w=>w._id===guest.wedding);
  if(!wedding) return res.status(404).json({success:false,message:"Mariage introuvable"});
  if(!guest.email && !guest.phone) return res.status(400).json({success:false,message:"Ajoutez un e-mail ou un numéro WhatsApp à cet invité"});

  guest.invitationToken = guest.invitationToken || crypto.randomBytes(18).toString("hex");
  guest.rsvp = guest.rsvp || "pending";
  guest.invitationSentAt = new Date().toISOString();
  guest.reminderDueAt = new Date(Date.now()+7*24*60*60*1000).toISOString();
  guest.refusalReason = guest.refusalReason || "";

  let emailResult={sent:false,reason:"no-email"};
  if(guest.email){
    emailResult=await safely(sendGuestInvitationEmail,{to:guest.email,guestName:guestName(guest),wedding,responseUrl:responseUrl(guest.invitationToken)});
  }
  writeDB(db);
  res.json({success:true,data:{guest,emailSent:Boolean(emailResult?.sent),responseUrl:responseUrl(guest.invitationToken),whatsappUrl:whatsappUrl(guest,wedding,guest.invitationToken)}});
});

router.get("/invitations/respond/:token",(req,res)=>{
  const db=readDB();
  const guest=(db.guests||[]).find(g=>g.invitationToken===req.params.token);
  if(!guest) return res.status(404).json({success:false,message:"Invitation introuvable ou expirée"});
  const wedding=(db.weddings||[]).find(w=>w._id===guest.wedding);
  res.json({success:true,data:{guest:{firstName:guest.firstName,lastName:guest.lastName,rsvp:guest.rsvp,respondedAt:guest.respondedAt,refusalReason:guest.refusalReason||""},wedding}});
});

router.post("/invitations/respond/:token",(req,res)=>{
  const {status,reason=""}=req.body||{};
  if(!["confirmed","declined"].includes(status)) return res.status(400).json({success:false,message:"Réponse invalide"});
  if(status==="declined" && !String(reason).trim()) return res.status(400).json({success:false,message:"Merci d'indiquer le motif du refus"});
  const db=readDB();
  const guest=(db.guests||[]).find(g=>g.invitationToken===req.params.token);
  if(!guest) return res.status(404).json({success:false,message:"Invitation introuvable ou expirée"});
  guest.rsvp=status;
  guest.refusalReason=status==="declined"?String(reason).trim():"";
  guest.respondedAt=new Date().toISOString();
  guest.updatedAt=new Date().toISOString();
  writeDB(db);
  res.json({success:true,data:{rsvp:guest.rsvp,refusalReason:guest.refusalReason,respondedAt:guest.respondedAt}});
});

async function sendDueReminders(){
  const db=readDB();
  const now=Date.now();
  const due=(db.guests||[]).filter(g=>g.rsvp==="pending" && g.email && g.invitationSentAt && now-new Date(g.invitationSentAt).getTime()>=7*24*60*60*1000 && (!g.lastReminderAt || now-new Date(g.lastReminderAt).getTime()>=7*24*60*60*1000));
  let sent=0;
  for(const guest of due){
    const wedding=(db.weddings||[]).find(w=>w._id===guest.wedding);
    if(!wedding || !guest.invitationToken) continue;
    const result=await safely(sendGuestReminderEmail,{to:guest.email,guestName:guestName(guest),wedding,responseUrl:responseUrl(guest.invitationToken)});
    if(result?.sent){ guest.lastReminderAt=new Date().toISOString(); guest.reminderCount=Number(guest.reminderCount||0)+1; sent++; }
  }
  writeDB(db);
  return {checked:due.length,sent};
}

router.get("/invitations/reminders",async (req,res)=>{
  const secret=process.env.CRON_SECRET;
  if(secret && req.headers.authorization!==`Bearer ${secret}`) return res.status(401).json({success:false,message:"Non autorisé"});
  const result=await sendDueReminders();
  res.json({success:true,data:result});
});

router.post("/invitations/reminders/run",async (_req,res)=>{
  const result=await sendDueReminders();
  res.json({success:true,data:result});
});

export default router;
