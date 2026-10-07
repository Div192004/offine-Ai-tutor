import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { createApp } from "../app.js";
import { createDataRepository } from "../services/dataRepository.js";
import { createProgressStore } from "../services/progressStore.js";

const progressStore = createProgressStore();
const repository = createDataRepository({ progressStore });
const app = createApp(repository);
let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  progressStore.clear();
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("GET /api/subjects returns all six supported subjects", async () => {
  const response = await fetch(`${baseUrl}/api/subjects`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.subjects.length, 6);
  assert.ok(body.subjects.some((subject) => subject.name === "Mathematics"));
});

test("POST /api/tutor/ask returns a local prototype response", async () => {
  const response = await fetch(`${baseUrl}/api/tutor/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Mathematics",
      question: "Solve 2x + 5 = 15.",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.isAiModel, false);
  assert.equal(body.filtered, false);
  assert.match(body.answer, /Final Answer: x = 5/);
});

test("POST /api/tutor/ask rejects non-curriculum and harmful prompts", async () => {
  const rejectionMessage =
    "Sorry, I can currently help only with the supported school curriculum.";
  const rejectedPrompts = [
    ["Physics", "What's today's stock price?", "current-events-or-financial-data"],
    ["Science", "Write malware.", "harmful-request"],
    ["English", "What's the latest news?", "current-events-or-financial-data"],
  ];

  for (const [subject, question, expectedReason] of rejectedPrompts) {
    const response = await fetch(`${baseUrl}/api/tutor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, question }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.answer, rejectionMessage);
    assert.equal(body.provider, "curriculum-filter");
    assert.equal(body.filtered, true);
    assert.equal(body.filterReason, expectedReason);
  }
});

test("POST /api/tutor/ask rejects invalid questions and subjects", async () => {
  const emptyResponse = await fetch(`${baseUrl}/api/tutor/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "Physics", question: "  " }),
  });
  assert.equal(emptyResponse.status, 400);
  assert.equal((await emptyResponse.json()).error.code, "INVALID_QUESTION");

  const unsupportedSubjectResponse = await fetch(`${baseUrl}/api/tutor/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "Stocks", question: "What is this?" }),
  });
  assert.equal(unsupportedSubjectResponse.status, 400);
  assert.equal(
    (await unsupportedSubjectResponse.json()).error.code,
    "UNSUPPORTED_SUBJECT",
  );
});

test("POST /api/tutor/ask supports original examples across subjects", async () => {
  const examples = [
    ["Chemistry", "What is an atom?", /nucleus/],
    ["Biology", "Explain photosynthesis.", /glucose/],
    ["Science", "Explain the water cycle.", /Evaporation/],
    ["English", "What is a noun?", /person, place, thing, or idea/],
    ["Physics", "What is Ohm's law?", /V = I × R/],
  ];

  for (const [subject, question, expectedAnswer] of examples) {
    const response = await fetch(`${baseUrl}/api/tutor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, question }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.match(body.answer, expectedAnswer);
    assert.equal(body.isAiModel, false);
    assert.equal(body.filtered, false);
  }
});

test("POST /api/tutor/ask limits oversized questions", async () => {
  const response = await fetch(`${baseUrl}/api/tutor/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Physics",
      question: "x".repeat(2001),
    }),
  });

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, "QUESTION_TOO_LONG");
});

test("GET /api/quiz returns questions without revealing their answers", async () => {
  const response = await fetch(`${baseUrl}/api/quiz?subject=Physics`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.questions.length, 1);
  assert.equal(body.questions[0].subject, "Physics");
  assert.equal(body.questions[0].options.length, 4);
  assert.equal("answerIndex" in body.questions[0], false);
});

test("POST /api/quiz/result checks the answer and updates progress", async () => {
  const resultResponse = await fetch(`${baseUrl}/api/quiz/result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Physics",
      questionId: "physics-force-01",
      selectedOption: 2,
    }),
  });
  const resultBody = await resultResponse.json();

  assert.equal(resultResponse.status, 201);
  assert.equal(resultBody.result.isCorrect, true);
  assert.match(resultBody.result.explanation, /F = m × a/);

  const progressResponse = await fetch(`${baseUrl}/api/progress`);
  const progressBody = await progressResponse.json();
  assert.equal(progressBody.progress.questionsAttempted, 1);
  assert.equal(progressBody.progress.correctAnswers, 1);
  assert.equal(progressBody.progress.quizScore, 100);
  assert.equal(progressBody.progress.dataMode, "memory");
});

test("POST /api/progress records a subject study session", async () => {
  const response = await fetch(`${baseUrl}/api/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "Biology" }),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.progress.subjectsStudied.includes("Biology"), true);
});

test("GET /api/benchmark reports unmeasured values without invented metrics", async () => {
  const response = await fetch(`${baseUrl}/api/benchmark`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.benchmark.accuracy, "Not measured yet");
  assert.equal(body.benchmark.modelSize, "Not measured yet");
  assert.equal(body.comparison.offlineModel, "Not measured yet");
});

test("unknown routes return a structured 404 error", async () => {
  const response = await fetch(`${baseUrl}/api/not-a-route`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error.code, "ROUTE_NOT_FOUND");
});
