import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  wedding: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  contactName: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  price: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ["prospect", "contacted", "booked", "paid"], default: "prospect" },
  notes: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
