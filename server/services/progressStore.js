export function createProgressStore() {
  const quizAttempts = [];
  const studySessions = [];

  return {
    addQuizAttempt(attempt) {
      quizAttempts.push(attempt);
    },
    addStudySession(session) {
      studySessions.push(session);
    },
    getProgress() {
      const questionsAttempted = quizAttempts.length;
      const correctAnswers = quizAttempts.filter(
        (attempt) => attempt.isCorrect,
      ).length;
      const subjectsStudied = [
        ...new Set([
          ...quizAttempts.map((attempt) => attempt.subject),
          ...studySessions.map((session) => session.subject),
        ]),
      ];
      const studyDates = new Set(
        [...quizAttempts, ...studySessions].map((activity) =>
          formatDate(new Date(activity.createdAt)),
        ),
      );

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
    clear() {
      quizAttempts.length = 0;
      studySessions.length = 0;
    },
  };
}

function getCurrentStreak(studyDates) {
  if (studyDates.size === 0) {
    return 0;
  }

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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
