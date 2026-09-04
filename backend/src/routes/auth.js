import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { sendWelcomeEmail, sendLoginEmail } from "../services/mailer.js";

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || "wedding-plus-secret", { expiresIn: "7d" });
}
async function safeMail(sender, payload) {
  try { return await sender(payload); } catch (e) { console.error("Wedding+ email error:", e.message); return { sent:false }; }
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Nom, email et mot de passe requis" });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Mot de passe trop court" });
    const normalized = email.toLowerCase();
    if (await User.findOne({ email: normalized })) return res.status(409).json({ success: false, message: "Un compte existe déjà avec cet email" });
    const user = await User.create({ name, email:normalized, passwordHash:await bcrypt.hash(password, 12), weddings:[], weddingId:null, onboardingCompleted:false });
    const emailResult = await safeMail(sendWelcomeEmail, { to:user.email, name:user.name });
    res.status(201).json({ success:true, data:{ user, token:signToken(user), needsOnboarding:true, emailSent:Boolean(emailResult?.sent) } });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email:String(req.body.email||"").toLowerCase() }).populate("weddings");
    if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) return res.status(401).json({ success:false, message:"Email ou mot de passe incorrect" });
    const emailResult = await safeMail(sendLoginEmail, { to:user.email, name:user.name });
    res.json({ success:true, data:{ user, token:signToken(user), needsOnboarding:!user.weddingId || !user.weddings.length, emailSent:Boolean(emailResult?.sent) } });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    await req.user.populate("weddings");
    res.json({ success:true, data:req.user });
  } catch (error) { next(error); }
});

export default router;
