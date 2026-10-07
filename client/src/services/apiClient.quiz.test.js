import assert from "node:assert/strict";
import test from "node:test";
import { getQuiz, submitQuizResult } from "./apiClient.js";

test("getQuiz includes the selected subject in the API request", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, "/api/quiz?subject=Physics");
    return Response.json({
      questions: [
        {
          id: "physics-force-01",
          subject: "Physics",
          prompt: "What is force?",
          options: ["A push or pull", "Heat", "Light", "Sound"],
        },
      ],
    });
  };

  try {
    const questions = await getQuiz({ subject: "Physics" });
    assert.equal(questions[0].subject, "Physics");
    assert.equal(questions[0].options.length, 4);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("submitQuizResult posts an option for server-side checking", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/quiz/result");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), {
      subject: "Physics",
      questionId: "physics-force-01",
      selectedOption: 2,
    });
    return Response.json(
      { result: { isCorrect: true, explanation: "Use F = m × a." } },
      { status: 201 },
    );
  };

  try {
    const result = await submitQuizResult({
      subject: "Physics",
      questionId: "physics-force-01",
      selectedOption: 2,
    });
    assert.equal(result.isCorrect, true);
    assert.match(result.explanation, /F = m × a/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
