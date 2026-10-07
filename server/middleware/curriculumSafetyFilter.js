import {
  checkCurriculumSafety,
  getCurriculumRejectionMessage,
} from "../services/curriculumFilter.js";

export function curriculumSafetyFilter(request, response, next) {
  const { question, subject } = request.body;
  const result = checkCurriculumSafety(question, subject);

  if (!result.allowed) {
    return response.json({
      subject,
      answer: getCurriculumRejectionMessage(),
      provider: "curriculum-filter",
      isAiModel: false,
      filtered: true,
      filterReason: result.reason,
    });
  }

  return next();
}
