import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { ensureDemoWedding } from "../services/demoWedding.js";

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Nom, email et mot de passe requis" });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Mot de passe trop court" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: "Un compte existe déjà avec cet email" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    await ensureDemoWedding(user);
    await user.populate("weddings");
    const token = signToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
    }
    await ensureDemoWedding(user);
    await user.populate("weddings");
    const token = signToken(user);
    res.json({ success: true, data: { user, token } });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    await ensureDemoWedding(req.user);
    await req.user.populate("weddings");
    res.json({ success: true, data: req.user });
  } catch (error) { next(error); }
});

export default router;
