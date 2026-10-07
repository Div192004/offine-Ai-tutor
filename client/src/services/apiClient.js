const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${apiBaseUrl}/api${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Could not reach the Offline Tutor API. Check that the server is running and try again.",
    );
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    throw new Error("The Offline Tutor API returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
        `The Offline Tutor API request failed (${response.status}).`,
    );
  }

  return body;
}

export async function getSubjects({ signal } = {}) {
  const body = await request("/subjects", { signal });
  if (!Array.isArray(body.subjects)) {
    throw new Error("The Offline Tutor API returned an invalid subjects list.");
  }
  return body.subjects;
}

export async function askTutor({ question, subject, signal }) {
  const body = await request("/tutor/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, subject }),
    signal,
  });

  if (typeof body.answer !== "string" || body.answer.length === 0) {
    throw new Error("The Offline Tutor API returned an empty tutor response.");
  }

  return body;
}

export async function getQuiz({ subject, signal } = {}) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  const body = await request(`/quiz${query}`, { signal });

  if (!Array.isArray(body.questions)) {
    throw new Error("The Offline Tutor API returned an invalid quiz.");
  }

  return body.questions;
}

export async function submitQuizResult({
  subject,
  questionId,
  selectedOption,
  signal,
}) {
  const body = await request("/quiz/result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, questionId, selectedOption }),
    signal,
  });

  if (typeof body.result?.isCorrect !== "boolean") {
    throw new Error("The Offline Tutor API returned an invalid quiz result.");
  }

  return body.result;
}

export async function getProgress({ signal } = {}) {
  const body = await request("/progress", { signal });
  const progress = body.progress;

  if (
    !progress ||
    !Number.isFinite(progress.questionsAttempted) ||
    !Number.isFinite(progress.correctAnswers) ||
    !Number.isFinite(progress.quizScore) ||
    !Array.isArray(progress.subjectsStudied) ||
    !Number.isFinite(progress.learningStreak)
  ) {
    throw new Error("The Offline Tutor API returned invalid progress data.");
  }

  return progress;
}

export async function getBenchmark({ signal } = {}) {
  const body = await request("/benchmark", { signal });
  const metricKeys = [
    "accuracy",
    "averageResponseTime",
    "modelSize",
    "memoryUsage",
    "testQuestions",
    "offlineCapability",
  ];

  if (
    !body.benchmark ||
    metricKeys.some((key) => typeof body.benchmark[key] !== "string") ||
    typeof body.comparison?.offlineModel !== "string" ||
    typeof body.comparison?.cloudReference !== "string"
  ) {
    throw new Error("The Offline Tutor API returned invalid benchmark data.");
  }

  return { benchmark: body.benchmark, comparison: body.comparison };
}
