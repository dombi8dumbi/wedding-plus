import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import mongoRouter from "./routes/index.js";
import demoRouter from "./routes/demo.js";
import invitationsRouter from "./routes/invitations.js";

const app = express();
const PORT = process.env.PORT || 5000;
const USE_MONGODB = process.env.USE_MONGODB === "true";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

let mongoPromise = null;
async function ensureMongoConnection() {
  if (!USE_MONGODB) return;
  if (mongoose.connection.readyState === 1) return;
  if (!mongoPromise) {
    mongoPromise = connectDB().catch((error) => {
      mongoPromise = null;
      throw error;
    });
  }
  await mongoPromise;
}

app.get("/api/health", async (_req, res) => {
  try {
    if (USE_MONGODB) await ensureMongoConnection();
    res.json({
      success: true,
      message: "Wedding+ API is running",
      mode: USE_MONGODB ? "mongodb" : "json-demo",
      database: USE_MONGODB ? "connected" : "local-demo"
    });
  } catch (error) {
    console.error("MongoDB health check failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Wedding+ API is running but MongoDB connection failed",
      mode: "mongodb",
      database: "disconnected"
    });
  }
});

app.use("/api", async (req, res, next) => {
  try {
    if (USE_MONGODB) await ensureMongoConnection();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({
      success: false,
      message: "Connexion à la base de données indisponible"
    });
  }
});

app.use("/api", invitationsRouter);
app.use("/api", USE_MONGODB ? mongoRouter : demoRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
});

if (!process.env.VERCEL) {
  (async () => {
    try {
      if (USE_MONGODB) {
        await ensureMongoConnection();
        console.log("Wedding+ backend mode: MongoDB");
      } else {
        console.log("Wedding+ backend mode: JSON demo database");
      }
      app.listen(PORT, () => console.log(`Wedding+ backend running on http://localhost:${PORT}`));
    } catch (error) {
      console.error("Backend startup failed:", error.message);
      process.exit(1);
    }
  })();
}

export default app;
