import express from "express";
import { isDatabaseConnected } from "./config/database.js";
import { createApiRouter } from "./routes/apiRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";
import { createDataRepository } from "./services/dataRepository.js";

export function createApp(repository = createDataRepository()) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "16kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      application: "Offline Tutor AI",
      dataMode: isDatabaseConnected() ? "mongodb" : "memory",
      persistentStorage: isDatabaseConnected(),
      message: isDatabaseConnected()
        ? "MongoDB is connected. Tutor responses use local prototype examples."
        : "The API is running with temporary in-memory progress data. Tutor responses use local prototype examples.",
    });
  });

  app.use("/api", createApiRouter(repository));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
