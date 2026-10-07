import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
