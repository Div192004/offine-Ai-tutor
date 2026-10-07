import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Explore subjects",
    description: "Find a school topic to learn about.",
    path: "/subjects",
    icon: "Aa",
    label: "Six subjects planned",
    className: "subject-shortcut",
  },
  {
    title: "Track your progress",
    description: "Review learning activity and quiz results.",
    path: "/progress",
    icon: "↗",
    label: "Progress dashboard",
    className: "progress-shortcut",
  },
  {
    title: "Model benchmark",
    description: "See how the future tutor will be evaluated.",
    path: "/benchmark",
    icon: "◷",
    label: "No results measured",
    className: "benchmark-shortcut",
  },
];

function HomePage() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    function updateConnectionStatus() {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);

    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, []);

  return (
    <div className="home-dashboard">
      <section className="welcome-panel home-hero" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="eyebrow">YOUR PERSONAL STUDY SPACE</p>
          <h1 id="welcome-title">Your AI tutor for school learning.</h1>
          <p className="welcome-description">
            Learn Anywhere. No Internet Required.
          </p>

          <div
            className={`connection-card${isOnline ? " connection-online" : " connection-offline"}`}
            role="status"
            aria-live="polite"
          >
            <span className="connection-indicator" aria-hidden="true" />
            <span className="connection-copy">
              <strong>{isOnline ? "You're online" : "You're offline"}</strong>
              <span>
                {isOnline
                  ? "Internet connection detected"
                  : "No internet connection detected"}
              </span>
            </span>
          </div>

          <p className="prototype-disclaimer">
            Connection status only. The tutor AI model is not connected or
            available offline yet.
          </p>

          <div className="home-actions">
            <Link className="primary-action" to="/tutor">
              <span>Start Learning</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="secondary-action" to="/quiz">
              <span className="quiz-action-icon" aria-hidden="true">
                ✓
              </span>
              Practice Quiz
            </Link>
          </div>
        </div>

        <div className="learning-art home-hero-art" aria-hidden="true">
          <div className="orbit orbit-outer" />
          <div className="orbit orbit-inner" />
          <div className="book-shape">
            <div className="book-spine" />
            <div className="book-page page-left">
              <span />
              <span />
              <span />
            </div>
            <div className="book-page page-right">
              <span />
              <span />
              <span />
            </div>
            <div className="book-spark">*</div>
          </div>
          <span className="floating-dot dot-one" />
          <span className="floating-dot dot-two" />
          <span className="floating-dot dot-three" />
          <div className="art-caption">Curiosity has no boundaries</div>
        </div>
      </section>

      <section className="home-shortcuts" aria-labelledby="shortcuts-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR LEARNING TOOLS</p>
            <h2 id="shortcuts-title">Pick up where curiosity takes you</h2>
          </div>
          <span className="section-caption">More features are on the way</span>
        </div>

        <div className="shortcut-grid">
          {quickLinks.map((item) => (
            <Link
              className={`shortcut-card ${item.className}`}
              key={item.path}
              to={item.path}
            >
              <span className="shortcut-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="shortcut-title">{item.title}</span>
              <span className="shortcut-description">{item.description}</span>
              <span className="shortcut-meta">
                {item.label}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
