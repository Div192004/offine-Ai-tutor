import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import subjectPresentation from "../data/subjects.js";
import { getSubjects } from "../services/apiClient.js";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubjects = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");

    try {
      const apiSubjects = await getSubjects({ signal });
      setSubjects(
        apiSubjects.map((subject) => {
          const presentation = subjectPresentation.find(
            (item) => item.name === subject.name,
          );
          return {
            ...subject,
            icon: presentation?.icon || "?",
            color: presentation?.color || "math",
          };
        }),
      );
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
    loadSubjects(controller.signal);
    return () => controller.abort();
  }, [loadSubjects]);

  return (
    <div className="subjects-page">
      <header className="subjects-heading">
        <div>
          <p className="eyebrow">LEARN AT YOUR OWN PACE</p>
          <h1>Explore subjects</h1>
          <p className="subjects-intro">
            Choose a subject and get ready to explore school topics, one idea at
            a time.
          </p>
        </div>
        {!isLoading && !error && subjects.length > 0 && (
          <span className="subjects-count">
            {subjects.length} learning areas
          </span>
        )}
      </header>

      {isLoading ? (
        <div className="subjects-state" role="status">
          Loading supported subjects…
        </div>
      ) : error ? (
        <div className="subjects-state subjects-state-error" role="alert">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => loadSubjects()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : subjects.length === 0 ? (
        <div className="subjects-state" role="status">
          No supported subjects are currently available from the API.
        </div>
      ) : (
        <section className="subjects-grid" aria-label="Available subjects">
          {subjects.map((subject) => (
            <article
              className={`subject-card subject-${subject.color || "math"}`}
              key={subject.id || subject.name}
            >
              <div className="subject-card-top">
                <span className="subject-icon" aria-hidden="true">
                  {subject.icon}
                </span>
                <span className="subject-card-label">SCHOOL SUBJECT</span>
              </div>

              <h2>{subject.name}</h2>
              <p>{subject.description}</p>

              <Link
                className="subject-start-link"
                to={`/tutor?subject=${encodeURIComponent(subject.name)}`}
              >
                Start Learning
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      )}

      {!isLoading && !error && (
        <aside className="subjects-prototype-note">
          <span className="note-icon" aria-hidden="true">
            i
          </span>
          <p>
            These subjects are loaded from the Express API. Tutor answers use
            prototype examples, not an AI model.
          </p>
        </aside>
      )}
    </div>
  );
}

export default SubjectsPage;
