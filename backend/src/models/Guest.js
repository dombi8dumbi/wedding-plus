import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  wedding: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", required: true, index: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  group: { type: String, trim: true },
  rsvp: { type: String, enum: ["pending", "confirmed", "declined"], default: "pending" },
  meal: { type: String, trim: true },
  plusOne: { type: Boolean, default: false },
  tableName: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("Guest", guestSchema);
