import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import app from "./app.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";
import { seedQuestions } from "./services/seedQuestions.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const port = Number(process.env.PORT || 5000);

await connectDatabase();
if (process.env.MONGODB_URI) {
  await seedQuestions();
  console.log("Sample quiz questions are ready in MongoDB.");
}

const server = app.listen(port, () => {
  console.log(`Offline Tutor AI API listening on http://localhost:${port}`);
});

async function stopServer() {
  server.close(async (error) => {
    if (error) {
      console.error("The API server did not shut down cleanly.", error);
      process.exitCode = 1;
    }
    await disconnectDatabase();
  });
}

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
