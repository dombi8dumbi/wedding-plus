import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import mongoRouter from "./routes/index.js";
import demoRouter from "./routes/demo.js";
import invitationsRouter from "./routes/invitations.js";

const app = express();
const PORT = process.env.PORT || 5000;
const USE_MONGODB = process.env.USE_MONGODB === "true";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Wedding+ API is running",
    mode: USE_MONGODB ? "mongodb" : "json-demo"
  });
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

async function start() {
  try {
    if (USE_MONGODB) {
      await connectDB();
      console.log("Wedding+ backend mode: MongoDB");
    } else {
      console.log("Wedding+ backend mode: JSON demo database");
    }
    app.listen(PORT, () => console.log(`Wedding+ backend running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

start();
