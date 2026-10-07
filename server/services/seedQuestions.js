import quizQuestions from "../dataset/quizQuestions.js";
import Question from "../models/Question.js";

export async function seedQuestions() {
  const operations = quizQuestions.map((question) => ({
    updateOne: {
      filter: { questionId: question.id },
      update: {
        $setOnInsert: {
          questionId: question.id,
          subject: question.subject,
          prompt: question.prompt,
          options: question.options,
          answerIndex: question.answerIndex,
          explanation: question.explanation,
          active: true,
        },
      },
      upsert: true,
    },
  }));

  await Question.bulkWrite(operations);
}
