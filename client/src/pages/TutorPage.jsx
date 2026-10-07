import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import subjects from "../data/subjects.js";
import { askTutor, getSubjects } from "../services/apiClient.js";

const suggestedQuestions = [
  "Explain Newton's second law.",
  "What is photosynthesis?",
  "Solve 2x + 5 = 15.",
];

function getSubjectFromQuery(value) {
  return subjects.find(
    (subject) => subject.name.toLowerCase() === value?.toLowerCase(),
  )?.name;
}

function TutorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState(
    () => getSubjectFromQuery(searchParams.get("subject")) || subjects[0].name,
  );
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subjectLoadError, setSubjectLoadError] = useState("");
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const requestControllerRef = useRef(null);
  const messageEndRef = useRef(null);
  const composerRef = useRef(null);

  useEffect(() => {
    const subjectFromQuery = getSubjectFromQuery(searchParams.get("subject"));
    if (subjectFromQuery) {
      setSelectedSubject(subjectFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSubjects() {
      try {
        const availableSubjects = await getSubjects({
          signal: controller.signal,
        });
        setSubjectOptions(availableSubjects);
        setSubjectLoadError("");
        setSelectedSubject((currentSubject) =>
          availableSubjects.some((subject) => subject.name === currentSubject)
            ? currentSubject
            : availableSubjects[0]?.name || "",
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          setSubjectLoadError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSubjectsLoading(false);
        }
      }
    }

    loadSubjects();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

  function handleSubjectChange(event) {
    const nextSubject = event.target.value;
    setSelectedSubject(nextSubject);
    setSearchParams({ subject: nextSubject });
  }

  async function handleSend(event) {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: crypto.randomUUID(), role: "user", text: trimmedQuestion },
    ]);
    setQuestion("");
    setIsLoading(true);
    setRequestError("");

    const controller = new AbortController();
    requestControllerRef.current = controller;
    try {
      const tutorResponse = await askTutor({
        question: trimmedQuestion,
        subject: selectedSubject,
        signal: controller.signal,
      });
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: tutorResponse.answer,
          provider: tutorResponse.provider,
        },
      ]);
      composerRef.current?.focus();
    } catch (error) {
      if (error.name !== "AbortError") {
        setRequestError(error.message);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsLoading(false);
      }
    }
  }

  function handleClearChat() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setMessages([]);
    setIsLoading(false);
    setQuestion("");
    setRequestError("");
    composerRef.current?.focus();
  }

  function handleSuggestedQuestion(text) {
    setQuestion(text);
    composerRef.current?.focus();
  }

  function focusMessage(messageId) {
    document.getElementById(messageId)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  const historyMessages = messages.filter((message) => message.role === "user");

  return (
    <section className="tutor-page" aria-labelledby="tutor-page-title">
      <header className="tutor-page-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING COMPANION</p>
          <h1 id="tutor-page-title">AI Tutor</h1>
        </div>
        <span className="tutor-prototype-badge">
          <span aria-hidden="true" />
          API-connected prototype
        </span>
      </header>

      <div className="tutor-workspace">
        <aside className="tutor-sidebar" aria-label="Tutor chat controls">
          <div className="tutor-sidebar-section">
            <label className="tutor-sidebar-label" htmlFor="tutor-subject">
              STUDY SUBJECT
            </label>
            <select
              className="tutor-subject-select"
              disabled={isSubjectsLoading || subjectOptions.length === 0}
              id="tutor-subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              {subjectOptions.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {subjectLoadError && (
              <p className="subject-load-error" role="alert">
                {subjectLoadError}
              </p>
            )}
          </div>

          <div className="tutor-history">
            <div className="tutor-history-heading">
              <span className="tutor-sidebar-label">IN THIS CHAT</span>
              <span className="history-count">{historyMessages.length}</span>
            </div>
            {historyMessages.length === 0 ? (
              <p className="history-empty">
                Questions you send will appear here.
              </p>
            ) : (
              <ul className="history-list">
                {historyMessages.map((message, index) => (
                  <li key={message.id}>
                    <button
                      className="history-item"
                      onClick={() => focusMessage(message.id)}
                      title={message.text}
                      type="button"
                    >
                      <span className="history-item-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{message.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="clear-chat-button"
            disabled={messages.length === 0 && !isLoading && !question}
            onClick={handleClearChat}
            type="button"
          >
            <span aria-hidden="true">⌫</span>
            Clear chat
          </button>

          <p className="sidebar-disclaimer">
            Responses come from the Express API's small example set. They are
            not generated by an AI model.
          </p>
        </aside>

        <div className="tutor-chat">
          <div className="chat-header">
            <div className="tutor-avatar" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <path
                  d="M7 13.5h26v17H7z"
                  fill="currentColor"
                  opacity=".25"
                />
                <path
                  d="M12 19h16M12 24h10M20 7v5M11 9l3 4M29 9l-3 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle cx="14" cy="16" r="1.5" fill="currentColor" />
                <circle cx="26" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="chat-header-copy">
              <strong>Study assistant</strong>
              <span>{selectedSubject} · Prototype mode</span>
            </div>
            <span className="chat-mode-pill">API PROTOTYPE · NOT AN AI MODEL</span>
          </div>

          <div
            className="chat-messages"
            aria-label="Chat conversation"
            aria-live="polite"
            role="log"
          >
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <div className="empty-chat-icon" aria-hidden="true">
                  <span>?</span>
                </div>
                <p className="empty-chat-eyebrow">LET'S LEARN TOGETHER</p>
                <h2>What would you like to understand?</h2>
                <p className="empty-chat-copy">
                  Choose a subject and type a school question below. The chat
                  connects to the Express API's small example set. It is not an
                  AI model and may not recognize every question.
                </p>
                <div className="suggestion-list" aria-label="Example questions">
                  {suggestedQuestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestedQuestion(suggestion)}
                      type="button"
                    >
                      <span aria-hidden="true">↗</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="message-list">
                {messages.map((message) => (
                  <article
                    aria-label={
                      message.role === "user"
                        ? "Your question"
                        : "Local prototype response"
                    }
                    className={`chat-message chat-message-${message.role}`}
                    id={message.id}
                    key={message.id}
                  >
                    {message.role === "assistant" && (
                      <span className="message-avatar" aria-hidden="true">
                        OT
                      </span>
                    )}
                    <div className="message-content">
                      <span className="message-author">
                        {message.role === "user"
                          ? "You"
                          : message.provider === "curriculum-filter"
                            ? "Curriculum safety filter"
                            : "Tutor · API example"}
                      </span>
                      <p>{message.text}</p>
                    </div>
                  </article>
                ))}
                {requestError && (
                  <div className="chat-request-error" role="alert">
                    <strong>Could not get a tutor response</strong>
                    <span>{requestError}</span>
                  </div>
                )}
                {isLoading && (
                  <div
                    className="chat-loading"
                    aria-label="Preparing local example response"
                    role="status"
                  >
                    <span className="message-avatar" aria-hidden="true">
                      OT
                    </span>
                    <span className="loading-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="loading-label">One moment</span>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>

          <div className="chat-composer-area">
            <form className="chat-composer" onSubmit={handleSend}>
              <label className="visually-hidden" htmlFor="tutor-question">
                Type your school question
              </label>
              <textarea
                id="tutor-question"
                maxLength={2000}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form.requestSubmit();
                  }
                }}
                placeholder={`Ask a ${selectedSubject.toLowerCase()} question...`}
                ref={composerRef}
                rows={2}
                value={question}
              />
              <button
                aria-label="Send question"
                className="send-question-button"
                disabled={!question.trim() || isLoading}
                type="submit"
              >
                <span>Send</span>
                <span aria-hidden="true">↑</span>
              </button>
            </form>
            <div className="composer-footnote">
              <span>Enter to send · Shift + Enter for a new line</span>
              <span>{question.length}/2000</span>
            </div>
            <p className="chat-privacy-note">
              Do not include personal or sensitive information in your
              questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TutorPage;
