import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../services/apiClient.js";

function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProgress = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");

    try {
      const currentProgress = await getProgress({ signal });
      setProgress(currentProgress);
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
    loadProgress(controller.signal);
    return () => controller.abort();
  }, [loadProgress]);

  const questionsAttempted = progress?.questionsAttempted ?? 0;
  const correctAnswers = progress?.correctAnswers ?? 0;
  const accuracy = progress?.quizScore ?? 0;
  const subjectsStudied = progress?.subjectsStudied ?? [];
  const learningStreak = progress?.learningStreak ?? 0;

  return (
    <section className="progress-page" aria-labelledby="progress-title">
      <header className="progress-page-heading">
        <div>
          <p className="eyebrow">SMALL STEPS ADD UP</p>
          <h1 id="progress-title">Your progress</h1>
          <p className="progress-intro">
            A snapshot of the quiz activity recorded by this prototype.
          </p>
        </div>
        <span className="progress-source-badge">
          <span aria-hidden="true" />
          Live from your API
        </span>
      </header>

      {isLoading ? (
        <div className="progress-state" role="status">
          <span className="quiz-state-spinner" aria-hidden="true" />
          Loading your progress…
        </div>
      ) : error ? (
        <div className="progress-state progress-state-error" role="alert">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => loadProgress()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {questionsAttempted === 0 && subjectsStudied.length === 0 && (
            <div className="progress-welcome-note">
              <span className="note-icon" aria-hidden="true">
                i
              </span>
              <p>
                Your dashboard starts at zero because no quiz attempts or study
                sessions have been recorded yet. Your activity will appear here
                as you use the quiz.
              </p>
              <Link to="/quiz">Try a practice quiz →</Link>
            </div>
          )}

          <section
            className="progress-metrics"
            aria-label="Learning progress summary"
          >
            <article className="progress-metric-card">
              <span className="progress-metric-icon metric-blue" aria-hidden="true">
                #
              </span>
              <span className="progress-metric-label">Questions attempted</span>
              <strong>{questionsAttempted}</strong>
              <span className="progress-metric-footnote">
                Server-recorded quiz answers
              </span>
            </article>

            <article className="progress-metric-card">
              <span className="progress-metric-icon metric-green" aria-hidden="true">
                ✓
              </span>
              <span className="progress-metric-label">Correct answers</span>
              <strong>{correctAnswers}</strong>
              <span className="progress-metric-footnote">
                Checked by the quiz API
              </span>
            </article>

            <article className="progress-metric-card">
              <span className="progress-metric-icon metric-purple" aria-hidden="true">
                %
              </span>
              <span className="progress-metric-label">Quiz score</span>
              <strong>{accuracy}%</strong>
              <span className="progress-metric-footnote">
                Correct answers ÷ attempts
              </span>
            </article>

            <article className="progress-metric-card">
              <span className="progress-metric-icon metric-orange" aria-hidden="true">
                ✦
              </span>
              <span className="progress-metric-label">Learning streak</span>
              <strong>
                {learningStreak}
                <small>{learningStreak === 1 ? " day" : " days"}</small>
              </strong>
              <span className="progress-metric-footnote">
                Consecutive days with activity
              </span>
            </article>
          </section>

          <div className="progress-detail-grid">
            <section
              className="progress-detail-card accuracy-card"
              aria-labelledby="accuracy-title"
            >
              <div className="progress-card-heading">
                <div>
                  <p className="eyebrow">QUIZ PERFORMANCE</p>
                  <h2 id="accuracy-title">Accuracy</h2>
                </div>
                <span className="progress-card-symbol" aria-hidden="true">
                  ◔
                </span>
              </div>
              <div
                className="accuracy-visual"
                role="img"
                aria-label={`${accuracy} percent quiz accuracy`}
                style={{ "--accuracy": `${accuracy}%` }}
              >
                <div className="accuracy-visual-inner">
                  <strong>{accuracy}%</strong>
                  <span>accuracy</span>
                </div>
              </div>
              <p className="accuracy-caption">
                {questionsAttempted === 0
                  ? "Accuracy will be calculated after your first quiz answer."
                  : `${correctAnswers} correct out of ${questionsAttempted} questions attempted.`}
              </p>
            </section>

            <section
              className="progress-detail-card subjects-studied-card"
              aria-labelledby="subjects-studied-title"
            >
              <div className="progress-card-heading">
                <div>
                  <p className="eyebrow">KEEP EXPLORING</p>
                  <h2 id="subjects-studied-title">Subjects studied</h2>
                </div>
                <span className="subjects-total">
                  {subjectsStudied.length}{" "}
                  {subjectsStudied.length === 1 ? "subject" : "subjects"}
                </span>
              </div>

              {subjectsStudied.length > 0 ? (
                <ul className="studied-subject-list">
                  {subjectsStudied.map((subject) => (
                    <li key={subject}>
                      <span className="studied-subject-dot" aria-hidden="true" />
                      <span>{subject}</span>
                      <span className="studied-subject-status">
                        Quiz activity
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="subjects-empty-state">
                  <p>
                    No subjects recorded yet. Complete a quiz question to get
                    started.
                  </p>
                  <Link to="/quiz">Explore quiz questions →</Link>
                </div>
              )}
            </section>
          </div>

          <footer className="progress-data-note">
            <span className="progress-data-indicator" aria-hidden="true" />
            <p>
              Progress is based on quiz attempts recorded by the API. It is
              stored{" "}
              {progress?.dataMode === "mongodb"
                ? "in MongoDB."
                : "in server memory and will reset when the API restarts."}
            </p>
          </footer>
        </>
      )}
    </section>
  );
}

export default ProgressPage;
