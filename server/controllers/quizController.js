import { randomUUID } from "node:crypto";
import subjects from "../dataset/subjects.js";

const supportedSubjectNames = new Set(subjects.map((subject) => subject.name));

export function createQuizController(repository) {
  return {
    async getQuiz(request, response) {
      const { subject } = request.query;

      if (subject && !supportedSubjectNames.has(subject)) {
        return response.status(400).json({
          error: {
            code: "UNSUPPORTED_SUBJECT",
            message: "Choose one of the supported school subjects.",
          },
        });
      }

      const storedQuestions = await repository.getQuestions(subject);
      const questions = storedQuestions.map((question) => ({
        id: question.questionId || question.id,
        subject: question.subject,
        prompt: question.prompt,
        options: question.options,
      }));

      return response.json({ questions });
    },

    async submitQuizResult(request, response) {
      const { subject, questionId, selectedOption } = request.body || {};

      if (
        !supportedSubjectNames.has(subject) ||
        typeof questionId !== "string" ||
        !Number.isInteger(selectedOption)
      ) {
        return response.status(400).json({
          error: {
            code: "INVALID_QUIZ_RESULT",
            message:
              "Provide a supported subject, question ID, and selected option number.",
          },
        });
      }

      const question = await repository.findQuestion(questionId, subject);

      if (!question) {
        return response.status(404).json({
          error: {
            code: "QUESTION_NOT_FOUND",
            message: "That quiz question was not found for the selected subject.",
          },
        });
      }

      if (
        selectedOption < 0 ||
        selectedOption >= question.options.length
      ) {
        return response.status(400).json({
          error: {
            code: "INVALID_OPTION",
            message: "Select one of the options shown for this question.",
          },
        });
      }

      const isCorrect = selectedOption === question.answerIndex;
      const result = {
        attemptId: randomUUID(),
        subject,
        questionId,
        selectedOption,
        isCorrect,
        createdAt: new Date().toISOString(),
      };

      const savedResult = await repository.addQuizAttempt(
        result,
        question.explanation,
      );
      return response.status(201).json({ result: savedResult });
    },
  };
}
