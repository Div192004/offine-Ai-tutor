import { generateTutorResponse } from "../services/aiService.js";

export function askTutor(request, response) {
  const { question, subject } = request.body || {};

  return response.json({
    subject,
    answer: generateTutorResponse(question, subject),
    provider: "local-example",
    isAiModel: false,
    filtered: false,
  });
}
