import mongoose from "mongoose";
import subjects from "../dataset/subjects.js";

const supportedSubjectNames = subjects.map((subject) => subject.name);

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      enum: supportedSubjectNames,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) =>
          options.length === 4 && options.every((option) => option.trim()),
        message: "A curriculum question must have four non-empty options.",
      },
    },
    answerIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      validate: {
        validator: Number.isInteger,
        message: "The answer index must be a whole number.",
      },
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
