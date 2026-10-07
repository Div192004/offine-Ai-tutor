import { useCallback, useEffect, useState } from "react";
import { getBenchmark } from "../services/apiClient.js";

const benchmarkMetrics = [
  {
    key: "accuracy",
    label: "Accuracy",
    icon: "%",
    style: "metric-blue",
    description: "Correct answers in a defined evaluation set",
  },
  {
    key: "averageResponseTime",
    label: "Average response time",
    icon: "◷",
    style: "metric-green",
    description: "Time taken to generate a response",
  },
  {
    key: "modelSize",
    label: "Model size",
    icon: "▣",
    style: "metric-purple",
    description: "Storage required by the model",
  },
  {
    key: "memoryUsage",
    label: "Memory usage",
    icon: "▤",
    style: "metric-orange",
    description: "Runtime memory used during inference",
  },
  {
    key: "testQuestions",
    label: "Test questions",
    icon: "#",
    style: "metric-blue",
    description: "Questions included in an evaluation",
  },
  {
    key: "offlineCapability",
    label: "Offline capability",
    icon: "⌁",
    style: "metric-green",
    description: "Verified ability to answer without internet",
  },
];
const notMeasured = "Not measured yet";

function BenchmarkPage() {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const hasMeasurements = benchmarkData
    ? benchmarkMetrics.some(
        ({ key }) => benchmarkData.benchmark[key] !== notMeasured,
      )
    : false;

  const loadBenchmark = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");

    try {
      setBenchmarkData(await getBenchmark({ signal }));
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
    loadBenchmark(controller.signal);
    return () => controller.abort();
  }, [loadBenchmark]);

  return (
    <section className="benchmark-page" aria-labelledby="benchmark-title">
      <header className="benchmark-page-heading">
        <div>
          <p className="eyebrow">MEASURE BEFORE YOU OPTIMIZE</p>
          <h1 id="benchmark-title">Model benchmark</h1>
          <p className="benchmark-intro">
            A transparent view of the measurements needed to evaluate a
            future on-device tutor.
          </p>
        </div>
        <span className="benchmark-status-badge">
          <span aria-hidden="true" />
          {hasMeasurements ? "Measurements available" : "Not measured yet"}
        </span>
      </header>

      {!isLoading && !error && !hasMeasurements && (
        <div className="benchmark-notice" role="note">
          <span className="benchmark-notice-icon" aria-hidden="true">
            i
          </span>
          <div>
            <strong>Measurements are not available yet</strong>
            <p>
              This prototype does not include a language model or benchmark
              results. Values will appear here only after real tests have been
              run and recorded.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="benchmark-state" role="status">
          <span className="quiz-state-spinner" aria-hidden="true" />
          Loading benchmark data…
        </div>
      ) : error ? (
        <div className="benchmark-state benchmark-state-error" role="alert">
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => loadBenchmark()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section
            className="benchmark-metrics"
            aria-label="Benchmark measurements"
          >
            {benchmarkMetrics.map((metric) => (
              <article className="benchmark-metric-card" key={metric.key}>
                <span
                  className={`progress-metric-icon ${metric.style}`}
                  aria-hidden="true"
                >
                  {metric.icon}
                </span>
                <span className="benchmark-metric-label">{metric.label}</span>
                <strong>{benchmarkData.benchmark[metric.key]}</strong>
                <span className="benchmark-metric-description">
                  {metric.description}
                </span>
              </article>
            ))}
          </section>

          <section
            className="benchmark-comparison"
            aria-labelledby="benchmark-comparison-title"
          >
            <div className="benchmark-section-heading">
              <div>
                <p className="eyebrow">FUTURE EVALUATION</p>
                <h2 id="benchmark-comparison-title">
                  Offline Model vs Cloud Reference
                </h2>
              </div>
              <span className="benchmark-not-compared">
                {benchmarkData.comparison.offlineModel !== notMeasured &&
                benchmarkData.comparison.cloudReference !== notMeasured
                  ? "Comparison data available"
                  : "Not compared yet"}
              </span>
            </div>
            <div className="benchmark-comparison-grid">
              <article className="benchmark-comparison-card">
                <span className="comparison-model-icon" aria-hidden="true">
                  ◉
                </span>
                <div>
                  <h3>Offline Model</h3>
                  <p>On-device model results</p>
                </div>
                <strong>{benchmarkData.comparison.offlineModel}</strong>
              </article>
              <article className="benchmark-comparison-card">
                <span className="comparison-cloud-icon" aria-hidden="true">
                  ☁
                </span>
                <div>
                  <h3>Cloud Reference</h3>
                  <p>Reference results for comparison</p>
                </div>
                <strong>{benchmarkData.comparison.cloudReference}</strong>
              </article>
            </div>
          </section>

          <footer className="benchmark-footnote">
            Benchmark values are supplied by the API. No values are estimated
            or generated by this page.
          </footer>
        </>
      )}
    </section>
  );
}

export default BenchmarkPage;
