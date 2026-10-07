import assert from "node:assert/strict";
import test from "node:test";
import Benchmark from "../models/Benchmark.js";
import Progress from "../models/Progress.js";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

test("User accepts a basic profile and normalizes email", async () => {
  const user = new User({ displayName: " Student ", email: "USER@example.com" });
  await user.validate();

  assert.equal(user.displayName, "Student");
  assert.equal(user.email, "user@example.com");
});

test("Question requires four options and a supported subject", async () => {
  const question = new Question({
    questionId: "math-sample",
    subject: "Mathematics",
    prompt: "What is 2 + 2?",
    options: ["2", "3", "4", "5"],
    answerIndex: 2,
    explanation: "Add the two numbers.",
  });
  await question.validate();

  const invalidQuestion = new Question({
    questionId: "math-invalid",
    subject: "General Knowledge",
    prompt: "Choose an answer.",
    options: ["A", "B"],
    answerIndex: 4,
    explanation: "Sample explanation.",
  });

  await assert.rejects(invalidQuestion.validate());
});

test("Quiz stores a selected option and correctness", async () => {
  const quiz = new Quiz({
    subject: "Physics",
    questionId: "physics-sample",
    selectedOption: 2,
    isCorrect: true,
  });
  await quiz.validate();

  assert.equal(quiz.isCorrect, true);
  assert.equal(quiz.userId, null);
});

test("Progress records a supported-subject study session", async () => {
  const progress = new Progress({ subject: "Biology" });
  await progress.validate();

  assert.equal(progress.activityType, "study-session");
  assert.ok(progress.studiedAt instanceof Date);
});

test("Benchmark defaults to honest unmeasured values", async () => {
  const benchmark = new Benchmark();
  await benchmark.validate();

  assert.equal(benchmark.accuracy, "Not measured yet");
  assert.equal(benchmark.memoryUsage, "Not measured yet");
});
