import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  weddings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wedding" }],
  weddingId: { type: mongoose.Schema.Types.ObjectId, ref: "Wedding", default: null },
  onboardingCompleted: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model("User", userSchema);
