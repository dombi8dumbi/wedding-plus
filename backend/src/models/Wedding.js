import mongoose from "mongoose";

const weddingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: { type: String, required: true, trim: true, default: "Notre mariage" },
  partner1: { type: String, required: true, trim: true },
  partner2: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  location: { type: String, trim: true },
  budgetTarget: { type: Number, min: 0, default: 0 },
  guestTarget: { type: Number, min: 0, default: 0 },
  style: { type: String, trim: true, default: "Élégant" },
  priorities: [{ type: String, trim: true }],
  status: { type: String, enum: ["planning", "jour-j", "completed"], default: "planning" }
}, { timestamps: true });

export default mongoose.model("Wedding", weddingSchema);
