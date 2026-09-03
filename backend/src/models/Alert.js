import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  wedding: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", required: true, index: true },
  type: { type: String, enum: ["info", "warning", "urgent"], default: "info" },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false },
  relatedType: { type: String, trim: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

export default mongoose.model("Alert", alertSchema);
