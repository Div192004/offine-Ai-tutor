import { useCallback, useEffect, useRef, useState } from "react";
import subjects from "../data/subjects.js";
import { getQuiz, submitQuizResult } from "../services/apiClient.js";

function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const requestControllerRef = useRef(null);

  const loadQuestions = useCallback(async (subject, signal) => {
    setIsLoading(true);
    setError("");
    setShowResults(false);
    setQuestions([]);
    setQuestionIndex(0);
    setSelectedOption(null);
    setResult(null);
    setCorrectAnswers(0);

    try {
      const quizQuestions = await getQuiz({
        ...(subject ? { subject } : {}),
        signal,
      });
      setQuestions(quizQuestions);
    } catch (loadError) {
      if (loadError.name !== "AbortError") {
        setError(loadError.message);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadQuestions(selectedSubject, controller.signal);
    return () => controller.abort();
  }, [loadQuestions, selectedSubject]);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

  function handleSubjectChange(event) {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setIsSubmitting(false);
    setSelectedSubject(event.target.value);
  }

  async function handleSubmitAnswer() {
    const question = questions[questionIndex];
    if (!question || selectedOption === null || isSubmitting || result) {
      return;
    }

    const controller = new AbortController();
    requestControllerRef.current = controller;
    setIsSubmitting(true);
    setError("");

    try {
      const submittedResult = await submitQuizResult({
        subject: question.subject,
        questionId: question.id,
        selectedOption,
        signal: controller.signal,
      });
      setResult(submittedResult);
      if (submittedResult.isCorrect) {
        setCorrectAnswers((current) => current + 1);
      }
    } catch (submitError) {
      if (submitError.name !== "AbortError") {
        setError(submitError.message);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsSubmitting(false);
      }
    }
  }

  function handleNext() {
    if (questionIndex === questions.length - 1) {
      setShowResults(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedOption(null);
    setResult(null);
    setError("");
  }

  function handleRestart() {
    setQuestionIndex(0);
    setSelectedOption(null);
    setResult(null);
    setCorrectAnswers(0);
    setError("");
    setShowResults(false);
  }

  const currentQuestion = questions[questionIndex];
  const progressValue = questions.length
    ? showResults
      ? 100
      : ((questionIndex + (result ? 1 : 0)) / questions.length) * 100
    : 0;

  return (
    <section className="quiz-page" aria-labelledby="quiz-title">
      <header className="quiz-page-heading">
        <div>
          <p className="eyebrow">A LITTLE PRACTICE GOES A LONG WAY</p>
          <h1 id="quiz-title">Practice Quiz</h1>
          <p className="quiz-intro">
            Try original sample questions and learn from each explanation.
          </p>
        </div>
        <div className="quiz-subject-control">
          <label htmlFor="quiz-subject">SUBJECT</label>
          <select
            id="quiz-subject"
            onChange={handleSubjectChange}
            value={selectedSubject}
          >
            <option value="">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject.name} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {isLoading ? (
        <div className="quiz-state" role="status">
          <span className="quiz-state-spinner" aria-hidden="true" />
          Loading sample questions…
        </div>
      ) : error && !currentQuestion ? (
        <div className="quiz-state quiz-state-error" role="alert">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => loadQuestions(selectedSubject)}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : questions.length === 0 ? (
        <div className="quiz-state">
          <span className="quiz-empty-icon" aria-hidden="true">
            ✓
          </span>
          <h2>No questions available yet</h2>
          <p>
            There are currently no quiz questions for this selection. Choose
            another subject or check back later.
          </p>
        </div>
      ) : showResults ? (
        <div className="quiz-results-panel">
          <div className="quiz-results-icon" aria-hidden="true">
            {correctAnswers === questions.length ? "★" : "✓"}
          </div>
          <p className="eyebrow">QUIZ COMPLETE</p>
          <h2>Nice work showing up to learn.</h2>
          <p className="quiz-results-score">
            You answered <strong>{correctAnswers}</strong> of{" "}
            <strong>{questions.length}</strong> correctly.
          </p>
          <div className="quiz-results-meter" aria-label="Final quiz score">
            <span
              style={{
                width: `${(correctAnswers / questions.length) * 100}%`,
              }}
            />
          </div>
          <p className="quiz-results-percentage">
            {Math.round((correctAnswers / questions.length) * 100)}% correct
          </p>
          <button
            className="quiz-primary-button"
            onClick={handleRestart}
            type="button"
          >
            Try another round
            <span aria-hidden="true">↻</span>
          </button>
        </div>
      ) : (
        <div className="quiz-layout">
          <aside className="quiz-overview-card">
            <div className="quiz-overview-top">
              <span className="quiz-overview-icon" aria-hidden="true">
                ✎
              </span>
              <span className="quiz-live-label">SAMPLE QUIZ</span>
            </div>
            <h2>{selectedSubject || "Mixed subjects"}</h2>
            <p>
              Take your time. Choose an answer, then submit it to see if it is
              correct and read the explanation.
            </p>

            <div className="quiz-score-card">
              <span>Correct so far</span>
              <strong>
                {correctAnswers}
                <span> / {questions.length}</span>
              </strong>
            </div>

            <div className="quiz-progress-copy">
              <span>Question progress</span>
              <span>
                {questionIndex + 1} of {questions.length}
              </span>
            </div>
            <div
              className="quiz-progress-track"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuemin="0"
              aria-valuemax={questions.length}
              aria-valuenow={questionIndex + (result ? 1 : 0)}
            >
              <span style={{ width: `${progressValue}%` }} />
            </div>

            <p className="quiz-storage-note">
              Your submitted answers are recorded by the server for the
              prototype.
            </p>
          </aside>

          <div className="quiz-question-card">
            <div className="quiz-question-topline">
              <span className="quiz-question-index">
                QUESTION {String(questionIndex + 1).padStart(2, "0")}
              </span>
              <span className="quiz-question-subject">
                {currentQuestion.subject}
              </span>
            </div>

            <h2>{currentQuestion.prompt}</h2>

            <fieldset className="quiz-options">
              <legend className="visually-hidden">Choose one answer</legend>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrectAnswer =
                  result && result.isCorrect && isSelected;
                const isIncorrectAnswer =
                  result && !result.isCorrect && isSelected;

                return (
                  <label
                    className={[
                      "quiz-option",
                      isSelected ? "quiz-option-selected" : "",
                      isCorrectAnswer ? "quiz-option-correct" : "",
                      isIncorrectAnswer ? "quiz-option-incorrect" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`${currentQuestion.id}-${index}`}
                  >
                    <input
                      checked={isSelected}
                      disabled={Boolean(result) || isSubmitting}
                      name="quiz-answer"
                      onChange={() => setSelectedOption(index)}
                      type="radio"
                      value={index}
                    />
                    <span className="quiz-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="quiz-option-text">{option}</span>
                    {isCorrectAnswer && (
                      <span className="option-result-icon" aria-label="Correct">
                        ✓
                      </span>
                    )}
                    {isIncorrectAnswer && (
                      <span
                        className="option-result-icon"
                        aria-label="Incorrect"
                      >
                        ×
                      </span>
                    )}
                  </label>
                );
              })}
            </fieldset>

            {error && (
              <div className="quiz-inline-error" role="alert">
                <span>{error}</span>
                {selectedOption !== null && !result && (
                  <button
                    onClick={handleSubmitAnswer}
                    type="button"
                    disabled={isSubmitting}
                  >
                    Retry submission
                  </button>
                )}
              </div>
            )}

            {result && (
              <div
                className={`quiz-feedback ${
                  result.isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"
                }`}
                role="status"
              >
                <strong>
                  {result.isCorrect ? "Correct answer!" : "Not quite—keep learning."}
                </strong>
                <p>{result.explanation}</p>
              </div>
            )}

            <div className="quiz-question-actions">
              <span className="quiz-honesty-note">
                {result
                  ? "Answer checked by the server"
                  : "Correct answers stay hidden until you submit"}
              </span>
              {result ? (
                <button
                  className="quiz-primary-button"
                  onClick={handleNext}
                  type="button"
                >
                  {questionIndex === questions.length - 1
                    ? "See results"
                    : "Next question"}
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button
                  className="quiz-primary-button"
                  disabled={selectedOption === null || isSubmitting}
                  onClick={handleSubmitAnswer}
                  type="button"
                >
                  {isSubmitting ? "Checking…" : "Submit answer"}
                  {!isSubmitting && <span aria-hidden="true">→</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default QuizPage;
