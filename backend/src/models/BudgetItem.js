import mongoose from "mongoose";

const budgetItemSchema = new mongoose.Schema({
  wedding: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", required: true, index: true },
  label: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  estimated: { type: Number, min: 0, default: 0 },
  actual: { type: Number, min: 0, default: 0 },
  paid: { type: Boolean, default: false },
  dueDate: { type: Date },
  notes: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("BudgetItem", budgetItemSchema);
