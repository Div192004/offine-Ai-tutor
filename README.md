# Offline Tutor AI

Phases 1–12 establish the web project structure, the responsive React
interface, route-based navigation, the Home, Subjects, Quiz, and Progress
pages, the Tutor Chat interface, local example responses, the Express API and
client connection, and Mongoose models with optional MongoDB persistence. The
response service is not an AI model. Offline AI inference has not been added.

## Project folders

- `client/` — React + Vite user interface
- `server/` — Node.js + Express API
- `ai/` — reserved for the replaceable local AI service in a later phase

## Requirements

- Node.js 20.19 or newer
- npm

## Install dependencies

Open a terminal in the `offline-tutor-ai` folder and run:

```bash
npm install --prefix client
npm install --prefix server
```

## MongoDB setup

MongoDB is optional for running the starter app. Without a connection setting,
the server reports memory mode and quiz/progress data resets when the server
restarts.

To enable persistence:

1. Install and start MongoDB locally, or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` in the project root.
3. Set `MONGODB_URI` in `.env` to your MongoDB connection string.
4. Restart the API server.

In PowerShell, copy the example file with:

```powershell
Copy-Item .env.example .env
```

When MongoDB connects, the server seeds the original sample quiz questions if
they are not already present. If a configured database cannot be reached, the
server reports the connection error and does not start in memory mode.

## Run the applications

Open two terminals, both in `offline-tutor-ai`.

Terminal 1:

```bash
npm run dev:client
```

Terminal 2:

```bash
npm run dev:server
```

The React interface is available at `http://localhost:5173`. Navigation
sections have working routes, with planned pages labeled until their features
are implemented. The API is available at `http://localhost:5000`.
During local development, Vite forwards `/api` requests to the Express server
on port 5000.

The AI model is not installed or running offline in this prototype. Tutor
responses currently come from limited built-in examples, not from an AI model.
Quiz attempts and study sessions are persisted when MongoDB is configured and
otherwise are kept in server memory.

The five simple Mongoose models are in `server/models/`: `User`, `Question`,
`Quiz`, `Progress`, and `Benchmark`. User authentication is not implemented;
for now, quiz and study records have no user and are shared as prototype
activity.

## API routes

- `GET /api/health` — API status
- `GET /api/subjects` — six supported school subjects
- `POST /api/tutor/ask` — curriculum-filtered local example response
- `GET /api/quiz` — original sample questions; optionally filter with `?subject=Physics`
- `POST /api/quiz/result` — submit an option; the server checks correctness
- `GET /api/progress` — quiz progress summary and current storage mode
- `POST /api/progress` — record a study session with `{ "subject": "Biology" }`
- `GET /api/benchmark` — benchmark fields marked “Not measured yet”

The Subjects page gets its subject list from `GET /api/subjects`. Tutor chat
submissions go to `POST /api/tutor/ask`; API failures are shown in the chat
rather than replaced with a browser-side response.

Tutor requests are validated and passed through separate curriculum-safety
middleware before the example response service. Questions outside the supported
school curriculum and harmful requests receive:

> Sorry, I can currently help only with the supported school curriculum.

This prototype filter uses a small set of subject keywords and safety patterns;
it is not a complete classifier. Its service is isolated so it can later be
replaced or moved into an on-device implementation.

The Benchmark page reads all six measurement fields and the Offline Model vs
Cloud Reference comparison from `GET /api/benchmark`. Since no model tests have
been run, the dashboard displays “Not measured yet” rather than estimates.

If the API is unavailable, the Subjects page shows an error with a retry
button. The Tutor page keeps the user's question in the conversation and shows
the API error so it can be corrected or submitted again after the connection
returns.

The Quiz page uses `GET /api/quiz` and `POST /api/quiz/result`. Submitted quiz
answers also contribute subject and activity-date information to the Progress
page. The API does not
send correct answers to the browser when listing questions. Answers are
checked by the server; the quiz score is shown when the question set is
finished. Do not treat the prototype's in-memory progress as permanent data.

The quiz currently uses a small set of original sample questions. If no
questions are available for a subject, the page explains that state instead
of creating placeholder questions.

## Run the tutor response tests

From the project folder:

```bash
npm --prefix client test
```

The API client tests also run with this command.

Run the API tests from the project folder:

```bash
npm --prefix server test
```

In PowerShell, use `npm.cmd` in place of `npm` if script execution policy
blocks the npm PowerShell shim.
