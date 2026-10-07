import { isDatabaseConnected } from "../config/database.js";
import quizQuestions from "../dataset/quizQuestions.js";
import Benchmark from "../models/Benchmark.js";
import Progress from "../models/Progress.js";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import { createProgressStore } from "./progressStore.js";

export function createDataRepository({
  progressStore = createProgressStore(),
} = {}) {
  return {
    async getQuestions(subject) {
      if (isDatabaseConnected()) {
        return Question.find({
          active: true,
          ...(subject ? { subject } : {}),
        })
          .sort({ subject: 1, questionId: 1 })
          .lean();
      }

      return quizQuestions.filter(
        (question) => !subject || question.subject === subject,
      );
    },

    async findQuestion(questionId, subject) {
      if (isDatabaseConnected()) {
        return Question.findOne({ questionId, subject, active: true }).lean();
      }

      return (
        quizQuestions.find(
          (question) =>
            question.id === questionId && question.subject === subject,
        ) || null
      );
    },

    async addQuizAttempt(attempt, explanation) {
      if (isDatabaseConnected()) {
        const quiz = await Quiz.create({
          subject: attempt.subject,
          questionId: attempt.questionId,
          selectedOption: attempt.selectedOption,
          isCorrect: attempt.isCorrect,
        });

        return {
          ...attempt,
          attemptId: String(quiz._id),
          createdAt: quiz.createdAt.toISOString(),
          explanation,
        };
      }

      progressStore.addQuizAttempt(attempt);
      return { ...attempt, explanation };
    },

    async addStudySession(session) {
      if (isDatabaseConnected()) {
        const progress = await Progress.create({
          subject: session.subject,
          studiedAt: session.createdAt,
        });

        return {
          ...session,
          sessionId: String(progress._id),
          createdAt: progress.studiedAt.toISOString(),
        };
      }

      progressStore.addStudySession(session);
      return session;
    },

    async getProgress() {
      if (!isDatabaseConnected()) {
        return progressStore.getProgress();
      }

      const [quizSummary] = await Quiz.aggregate([
        {
          $group: {
            _id: null,
            questionsAttempted: { $sum: 1 },
            correctAnswers: {
              $sum: { $cond: ["$isCorrect", 1, 0] },
            },
          },
        },
      ]);
      const studySessions = await Progress.find()
        .select("subject studiedAt")
        .lean();
      const questionsAttempted = quizSummary?.questionsAttempted || 0;
      const correctAnswers = quizSummary?.correctAnswers || 0;
      const subjectsStudied = [
        ...new Set([
          ...studySessions.map((session) => session.subject),
          ...(await Quiz.distinct("subject")),
        ]),
      ];
      const studyDates = new Set([
        ...studySessions.map((session) => formatDate(session.studiedAt)),
        ...(await Quiz.find().select("createdAt").lean()).map((attempt) =>
          formatDate(attempt.createdAt),
        ),
      ]);

      return {
        questionsAttempted,
        correctAnswers,
        quizScore:
          questionsAttempted === 0
            ? 0
            : Math.round((correctAnswers / questionsAttempted) * 100),
        subjectsStudied,
        learningStreak: getCurrentStreak(studyDates),
      };
    },

    async getBenchmark() {
      if (isDatabaseConnected()) {
        const benchmark = await Benchmark.findOne()
          .sort({ createdAt: -1 })
          .lean();
        if (benchmark) {
          return {
            accuracy: benchmark.accuracy,
            averageResponseTime: benchmark.averageResponseTime,
            modelSize: benchmark.modelSize,
            memoryUsage: benchmark.memoryUsage,
            testQuestions: benchmark.testQuestions,
            offlineCapability: benchmark.offlineCapability,
          };
        }
      }

      return {
        accuracy: "Not measured yet",
        averageResponseTime: "Not measured yet",
        modelSize: "Not measured yet",
        memoryUsage: "Not measured yet",
        testQuestions: "Not measured yet",
        offlineCapability: "Not measured yet",
      };
    },
  };
}

function formatDate(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentStreak(studyDates) {
  const today = new Date();
  const checkDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  let streak = 0;

  while (studyDates.has(formatDate(checkDate))) {
    streak += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  if (streak === 0) {
    checkDate.setTime(today.getTime());
    checkDate.setHours(0, 0, 0, 0);
    checkDate.setDate(checkDate.getDate() - 1);

    while (studyDates.has(formatDate(checkDate))) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return streak;
}
