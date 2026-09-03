import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Wedding+ API is running" });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ success: false, message: error.message || "Erreur serveur" });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Wedding+ backend running on port ${PORT}`));
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

start();
