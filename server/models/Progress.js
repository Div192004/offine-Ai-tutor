import mongoose from "mongoose";
import subjects from "../dataset/subjects.js";

const supportedSubjectNames = subjects.map((subject) => subject.name);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subject: {
      type: String,
      required: true,
      enum: supportedSubjectNames,
    },
    activityType: {
      type: String,
      enum: ["study-session"],
      default: "study-session",
    },
    studiedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, studiedAt: -1 });

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
