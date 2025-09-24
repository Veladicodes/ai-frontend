import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  image: String,
  lastLogin: { type: Date, default: Date.now },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

export default mongoose.models.User || mongoose.model("User", UserSchema);