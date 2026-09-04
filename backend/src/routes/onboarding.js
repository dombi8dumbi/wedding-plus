import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Wedding from "../models/Wedding.js";
import Task from "../models/Task.js";
import BudgetItem from "../models/BudgetItem.js";
import TimelineItem from "../models/TimelineItem.js";
import Alert from "../models/Alert.js";

const router=Router();

router.post("/onboarding",requireAuth,async(req,res,next)=>{try{
  if(req.user.weddingId)return res.status(409).json({success:false,message:"Votre mariage est déjà configuré"});
  const{partner1,partner2,date,location,budgetTarget,guestTarget,style,priorities=[]}=req.body;
  if(!partner1||!partner2||!date)return res.status(400).json({success:false,message:"Prénoms des partenaires et date requis"});
  const wedding=await Wedding.create({owner:req.user._id,title:`Mariage de ${partner1} & ${partner2}`,partner1,partner2,date,location,budgetTarget:Number(budgetTarget)||0,guestTarget:Number(guestTarget)||0,style:style||"Élégant",priorities,status:"planning"});
  req.user.weddings=[wedding._id];req.user.weddingId=wedding._id;req.user.onboardingCompleted=true;await req.user.save();
  const traditional=(style||"").toLowerCase().includes("tradition");
  const tasks=traditional?["Lister les traditions à intégrer","Prévoir les tenues traditionnelles","Organiser l’accueil des aînés","Valider le menu traditionnel","Préparer les temps forts culturels","Préparer les cadeaux aux familles"]:["Définir la liste des invités","Rechercher le lieu de réception","Établir le budget","Sélectionner le traiteur","Choisir photo & vidéo","Préparer les invitations"];
  await Task.insertMany(tasks.map((title,i)=>({wedding:wedding._id,title,priority:i<2?"high":"medium",status:"todo"})));
  const labels=traditional?["Tenues traditionnelles","Cérémonie & coutumes","Traiteur traditionnel","Musique & animation","Décoration culturelle","Cadeaux aux familles"]:["Lieu","Traiteur","Tenues","Photo & vidéo","Décoration","Animation"];
  const weights=[.28,.25,.15,.12,.10,.10];
  await BudgetItem.insertMany(labels.map((label,i)=>({wedding:wedding._id,label,category:label,estimated:Math.round((Number(budgetTarget)||0)*weights[i]),actual:0,paid:false})));
  const d=new Date(date);const createTime=(hour,title)=>new Date(d.getFullYear(),d.getMonth(),d.getDate(),hour,0);
  await TimelineItem.insertMany([{wedding:wedding._id,title:"Préparatifs",startTime:createTime(8,""),location,status:"planned"},{wedding:wedding._id,title:traditional?"Cérémonie traditionnelle":"Cérémonie",startTime:createTime(14,""),location,status:"planned"},{wedding:wedding._id,title:"Réception",startTime:createTime(18,""),location,status:"planned"}]);
  await Alert.create({wedding:wedding._id,type:"info",title:`Suggestions ${style||"personnalisées"} prêtes`,message:"Wedding+ a préparé vos premières suggestions.",read:false});
  await req.user.populate("weddings");
  res.status(201).json({success:true,data:{wedding,user:req.user,suggestions:{tasks:tasks.length,budget:labels.length,timeline:3}}});
}catch(e){next(e)}});

export default router;
