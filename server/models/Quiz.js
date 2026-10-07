import mongoose from "mongoose";
import subjects from "../dataset/subjects.js";

const supportedSubjectNames = subjects.map((subject) => subject.name);

const quizSchema = new mongoose.Schema(
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
    questionId: {
      type: String,
      required: true,
      trim: true,
    },
    selectedOption: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      validate: {
        validator: Number.isInteger,
        message: "The selected option must be a whole number.",
      },
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

quizSchema.index({ userId: 1, createdAt: -1 });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
