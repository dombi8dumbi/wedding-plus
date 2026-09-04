import { Router } from "express";
import crypto from "crypto";
import Guest from "../models/Guest.js";
import Wedding from "../models/Wedding.js";
import { sendGuestInvitationEmail, sendGuestReminderEmail } from "../services/mailer.js";

const router = Router();
const baseUrl=()=>String(process.env.CLIENT_URL||"https://weddingplus.vercel.app").replace(/\/$/,"");
const responseUrl=(token)=>`${baseUrl()}/invitation/${token}`;
const guestName=(g)=>`${g?.firstName||""} ${g?.lastName||""}`.trim()||"cher invité";
const normalizePhone=(v)=>String(v||"").replace(/[^0-9]/g,"");
function whatsappUrl(guest,wedding,token){const phone=normalizePhone(guest.phone);if(!phone)return null;const couple=`${wedding.partner1||""} & ${wedding.partner2||""}`.trim();const text=`Bonjour ${guest.firstName||""} 💍\n${couple} ont le plaisir de vous inviter à leur mariage. Merci de confirmer votre présence ici : ${responseUrl(token)}`;return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;}
async function safely(fn,payload){try{return await fn(payload)}catch(e){console.error("Wedding+ invitation email error:",e.message);return{sent:false,reason:e.message}}}

router.post("/invitations/:guestId/send",async(req,res,next)=>{try{const guest=await Guest.findById(req.params.guestId);if(!guest)return res.status(404).json({success:false,message:"Invité introuvable"});const wedding=await Wedding.findById(guest.wedding);if(!wedding)return res.status(404).json({success:false,message:"Mariage introuvable"});if(!guest.email&&!guest.phone)return res.status(400).json({success:false,message:"Ajoutez un e-mail ou un numéro WhatsApp à cet invité"});guest.invitationToken=guest.invitationToken||crypto.randomBytes(18).toString("hex");guest.rsvp=guest.rsvp||"pending";guest.invitationSentAt=new Date();await guest.save();let emailResult={sent:false};if(guest.email)emailResult=await safely(sendGuestInvitationEmail,{to:guest.email,guestName:guestName(guest),wedding,responseUrl:responseUrl(guest.invitationToken)});res.json({success:true,data:{guest,emailSent:Boolean(emailResult?.sent),responseUrl:responseUrl(guest.invitationToken),whatsappUrl:whatsappUrl(guest,wedding,guest.invitationToken)}})}catch(e){next(e)}});

router.get("/invitations/respond/:token",async(req,res,next)=>{try{const guest=await Guest.findOne({invitationToken:req.params.token});if(!guest)return res.status(404).json({success:false,message:"Invitation introuvable ou expirée"});const wedding=await Wedding.findById(guest.wedding);res.json({success:true,data:{guest,wedding}})}catch(e){next(e)}});
router.post("/invitations/respond/:token",async(req,res,next)=>{try{const{status,reason=""}=req.body||{};if(!["confirmed","declined"].includes(status))return res.status(400).json({success:false,message:"Réponse invalide"});if(status==="declined"&&!String(reason).trim())return res.status(400).json({success:false,message:"Merci d'indiquer le motif du refus"});const guest=await Guest.findOne({invitationToken:req.params.token});if(!guest)return res.status(404).json({success:false,message:"Invitation introuvable ou expirée"});guest.rsvp=status;guest.refusalReason=status==="declined"?String(reason).trim():"";guest.respondedAt=new Date();await guest.save();res.json({success:true,data:guest})}catch(e){next(e)}});

async function sendDueReminders(){const cutoff=new Date(Date.now()-7*24*60*60*1000);const guests=await Guest.find({rsvp:"pending",email:{$exists:true,$ne:""},invitationSentAt:{$lte:cutoff},$or:[{reminderSentAt:{$exists:false}},{reminderSentAt:null}]});let sent=0;for(const guest of guests){const wedding=await Wedding.findById(guest.wedding);if(!wedding||!guest.invitationToken)continue;const result=await safely(sendGuestReminderEmail,{to:guest.email,guestName:guestName(guest),wedding,responseUrl:responseUrl(guest.invitationToken)});if(result?.sent){guest.reminderSentAt=new Date();await guest.save();sent++}}return{checked:guests.length,sent}}
router.get("/invitations/reminders",async(req,res,next)=>{try{const secret=process.env.CRON_SECRET;if(secret&&req.headers.authorization!==`Bearer ${secret}`)return res.status(401).json({success:false,message:"Non autorisé"});res.json({success:true,data:await sendDueReminders()})}catch(e){next(e)}});
router.post("/invitations/reminders/run",async(_req,res,next)=>{try{res.json({success:true,data:await sendDueReminders()})}catch(e){next(e)}});

export default router;
