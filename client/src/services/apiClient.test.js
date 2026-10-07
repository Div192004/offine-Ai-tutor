import assert from "node:assert/strict";
import test from "node:test";
import {
  askTutor,
  getBenchmark,
  getProgress,
  getSubjects,
} from "./apiClient.js";

test("getSubjects reads the subjects collection from the API", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/subjects");
    assert.equal(options.headers.Accept, "application/json");
    return Response.json({
      subjects: [{ name: "Mathematics", description: "Numbers and patterns." }],
    });
  };

  try {
    const subjects = await getSubjects();
    assert.equal(subjects[0].name, "Mathematics");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("askTutor posts the selected subject and question to the API", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/tutor/ask");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), {
      question: "Explain Newton's second law.",
      subject: "Physics",
    });
    return Response.json({ answer: "F = m × a", isAiModel: false });
  };

  try {
    const result = await askTutor({
      question: "Explain Newton's second law.",
      subject: "Physics",
    });
    assert.equal(result.answer, "F = m × a");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("API errors are surfaced to the caller", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json(
      {
        error: {
          code: "UNSUPPORTED_SUBJECT",
          message: "Choose one of the supported school subjects.",
        },
      },
      { status: 400 },
    );

  try {
    await assert.rejects(
      getSubjects(),
      /Choose one of the supported school subjects/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getProgress reads and validates the progress summary", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, "/api/progress");
    return Response.json({
      progress: {
        questionsAttempted: 4,
        correctAnswers: 3,
        quizScore: 75,
        subjectsStudied: ["Physics"],
        learningStreak: 2,
        dataMode: "memory",
      },
    });
  };

  try {
    const progress = await getProgress();
    assert.equal(progress.quizScore, 75);
    assert.deepEqual(progress.subjectsStudied, ["Physics"]);
    assert.equal(progress.dataMode, "memory");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getProgress reports malformed API data rather than using fake defaults", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ progress: {} });

  try {
    await assert.rejects(getProgress(), /invalid progress data/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getBenchmark reads unmeasured values and validates the complete response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, "/api/benchmark");
    return Response.json({
      benchmark: {
        accuracy: "Not measured yet",
        averageResponseTime: "Not measured yet",
        modelSize: "Not measured yet",
        memoryUsage: "Not measured yet",
        testQuestions: "Not measured yet",
        offlineCapability: "Not measured yet",
      },
      comparison: {
        offlineModel: "Not measured yet",
        cloudReference: "Not measured yet",
      },
    });
  };

  try {
    const result = await getBenchmark();
    assert.equal(result.benchmark.accuracy, "Not measured yet");
    assert.equal(result.comparison.cloudReference, "Not measured yet");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getBenchmark reports incomplete API data instead of inventing values", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json({
      benchmark: { accuracy: "Not measured yet" },
      comparison: {},
    });

  try {
    await assert.rejects(getBenchmark(), /invalid benchmark data/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
