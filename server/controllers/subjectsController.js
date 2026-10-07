import subjects from "../dataset/subjects.js";

export function getSubjects(_request, response) {
  response.json({ subjects });
}
