import assert from "node:assert/strict";
import test from "node:test";
import { generateTutorResponse } from "./aiService.js";

test("returns a step-by-step response for a supported physics topic", () => {
  const response = generateTutorResponse(
    "Explain Newton's second law.",
    "Physics",
  );

  assert.match(response, /F = m × a/);
  assert.match(response, /Step 1:/);
  assert.match(response, /Final Answer:/);
});

test("formats simple linear equation answers in math mode", () => {
  const response = generateTutorResponse("Solve 2x + 5 = 15.", "Mathematics");

  assert.match(response, /Given\n2x \+ 5 = 15\n/);
  assert.match(response, /Formula/);
  assert.match(response, /Step 1:/);
  assert.match(response, /Final Answer: x = 5/);
});

test("normalizes a linear equation with a negative constant", () => {
  const response = generateTutorResponse("x - 3 = 9", "Mathematics");

  assert.match(response, /Final Answer: x = 12/);
});

test("does not try to solve equations with zero x coefficients", () => {
  const response = generateTutorResponse("0x + 5 = 15", "Mathematics");

  assert.match(response, /don't have a matching example/);
  assert.doesNotMatch(response, /Final Answer:/);
});

test("returns an explicit fallback for an unsupported prompt", () => {
  const response = generateTutorResponse("Tell me a joke.", "Physics");

  assert.match(response, /don't have a matching example/);
  assert.match(response, /not an AI model/);
});
