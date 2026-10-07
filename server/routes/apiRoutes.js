import { Router } from "express";
import { createBenchmarkController } from "../controllers/benchmarkController.js";
import { createProgressController } from "../controllers/progressController.js";
import { createQuizController } from "../controllers/quizController.js";
import { getSubjects } from "../controllers/subjectsController.js";
import { askTutor } from "../controllers/tutorController.js";
import { curriculumSafetyFilter } from "../middleware/curriculumSafetyFilter.js";
import { validateTutorRequest } from "../middleware/validateTutorRequest.js";
import { createDataRepository } from "../services/dataRepository.js";

function createApiRouter(repository = createDataRepository()) {
  const router = Router();
  const quizController = createQuizController(repository);
  const progressController = createProgressController(repository);
  const benchmarkController = createBenchmarkController(repository);

  router.get("/subjects", getSubjects);
  router.post(
    "/tutor/ask",
    validateTutorRequest,
    curriculumSafetyFilter,
    askTutor,
  );
  router.get("/quiz", quizController.getQuiz);
  router.post("/quiz/result", quizController.submitQuizResult);
  router.get("/progress", progressController.getProgress);
  router.post("/progress", progressController.addProgress);
  router.get("/benchmark", benchmarkController.getBenchmark);

  return router;
}

export { createApiRouter };
export default createApiRouter();
