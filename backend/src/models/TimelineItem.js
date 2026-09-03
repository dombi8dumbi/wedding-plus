import mongoose from "mongoose";

const timelineItemSchema = new mongoose.Schema({
  wedding: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", required: true, index: true },
  title: { type: String, required: true, trim: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  location: { type: String, trim: true },
  responsible: { type: String, trim: true },
  status: { type: String, enum: ["planned", "in-progress", "done", "delayed"], default: "planned" },
  notes: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("TimelineItem", timelineItemSchema);
