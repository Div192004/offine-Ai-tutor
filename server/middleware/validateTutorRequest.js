import subjects from "../dataset/subjects.js";

const maximumQuestionLength = 2000;
const supportedSubjectNames = new Set(subjects.map((subject) => subject.name));

export function validateTutorRequest(request, response, next) {
  const { question, subject } = request.body || {};

  if (typeof question !== "string" || question.trim().length === 0) {
    return response.status(400).json({
      error: {
        code: "INVALID_QUESTION",
        message: "Please provide a non-empty question.",
      },
    });
  }

  if (question.length > maximumQuestionLength) {
    return response.status(400).json({
      error: {
        code: "QUESTION_TOO_LONG",
        message: `Questions must be ${maximumQuestionLength} characters or fewer.`,
      },
    });
  }

  if (!supportedSubjectNames.has(subject)) {
    return response.status(400).json({
      error: {
        code: "UNSUPPORTED_SUBJECT",
        message: "Choose one of the supported school subjects.",
      },
    });
  }

  request.body.question = question.trim();
  return next();
}
