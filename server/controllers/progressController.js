import { randomUUID } from "node:crypto";
import subjects from "../dataset/subjects.js";
import { isDatabaseConnected } from "../config/database.js";

const supportedSubjectNames = new Set(subjects.map((subject) => subject.name));

export function createProgressController(repository) {
  return {
    async getProgress(_request, response) {
      response.json({
        progress: {
          ...(await repository.getProgress()),
          dataMode: isDatabaseConnected() ? "mongodb" : "memory",
        },
      });
    },

    async addProgress(request, response) {
      const { subject } = request.body || {};

      if (!supportedSubjectNames.has(subject)) {
        return response.status(400).json({
          error: {
            code: "UNSUPPORTED_SUBJECT",
            message: "Choose one of the supported school subjects.",
          },
        });
      }

      const session = {
        sessionId: randomUUID(),
        subject,
        createdAt: new Date().toISOString(),
      };
      const savedSession = await repository.addStudySession(session);

      return response.status(201).json({
        message: "Study session recorded.",
        session: savedSession,
        progress: await repository.getProgress(),
      });
    },
  };
}
