import mongoose from "mongoose";

const notMeasured = "Not measured yet";

const benchmarkSchema = new mongoose.Schema(
  {
    modelName: {
      type: String,
      trim: true,
      default: "Offline Model",
      maxlength: 100,
    },
    accuracy: { type: String, default: notMeasured },
    averageResponseTime: { type: String, default: notMeasured },
    modelSize: { type: String, default: notMeasured },
    memoryUsage: { type: String, default: notMeasured },
    testQuestions: { type: String, default: notMeasured },
    offlineCapability: { type: String, default: notMeasured },
  },
  { timestamps: true },
);

const Benchmark =
  mongoose.models.Benchmark || mongoose.model("Benchmark", benchmarkSchema);

export default Benchmark;
