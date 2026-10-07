import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import BrandMark from "./components/BrandMark.jsx";
import PrototypeStatus from "./components/PrototypeStatus.jsx";
import HomePage from "./pages/HomePage.jsx";
import BenchmarkPage from "./pages/BenchmarkPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";
import TutorPage from "./pages/TutorPage.jsx";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Subjects", path: "/subjects" },
  { label: "AI Tutor", path: "/tutor" },
  { label: "Practice Quiz", path: "/quiz" },
  { label: "Progress", path: "/progress" },
  { label: "Benchmark", path: "/benchmark" },
  { label: "Settings", path: "/settings" },
];

function AppLayout() {
  return (
    <div className="page-frame">
      <header className="topbar">
        <BrandMark />
        <PrototypeStatus />
      </header>

      <nav className="main-navigation" aria-label="Main navigation">
        {navigationItems.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `navigation-link${isActive ? " navigation-link-active" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="page-footer">
        <span>Offline Tutor AI</span>
        <span>Learn Anywhere. No Internet Required.</span>
      </footer>
    </div>
  );
}

function ComingSoonPage({ title, phase }) {
  return (
    <section className="coming-soon-panel" aria-labelledby="coming-soon-title">
      <p className="eyebrow">COMING IN PHASE {phase}</p>
      <h1 id="coming-soon-title">{title}</h1>
      <p className="welcome-description">
        This page has a working route. Its learning features will be added in
        the planned phase.
      </p>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="coming-soon-panel" aria-labelledby="not-found-title">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1 id="not-found-title">That page isn’t here.</h1>
      <p className="welcome-description">
        Use the navigation above to find your way back to a section.
      </p>
      <NavLink className="home-link" to="/">
        Go to Home
      </NavLink>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="tutor" element={<TutorPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="benchmark" element={<BenchmarkPage />} />
          <Route
            path="settings"
            element={<ComingSoonPage title="Settings" phase="14" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
