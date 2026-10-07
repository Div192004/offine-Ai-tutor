const tutorExamples = {
  Physics: [
    {
      keywords: ["newton", "second law"],
      response: [
        "Newton's second law relates net force, mass, and acceleration.",
        "",
        "Formula",
        "F = m × a",
        "",
        "Step 1: Identify the mass: 5 kg.",
        "Step 2: Identify the acceleration: 2 m/s².",
        "Step 3: Multiply: F = 5 × 2 = 10 N.",
        "",
        "Final Answer: The net force is 10 N.",
      ].join("\n"),
    },
    {
      keywords: ["ohm", "law"],
      response: [
        "Ohm's law describes the relationship between voltage, current, and resistance.",
        "",
        "Formula",
        "V = I × R",
        "",
        "Step 1: Identify the current (I) and resistance (R).",
        "Step 2: Multiply current by resistance.",
        "Step 3: The product is voltage (V), measured in volts.",
        "",
        "Example: If I = 2 A and R = 3 Ω, then V = 2 × 3 = 6 V.",
      ].join("\n"),
    },
    {
      keywords: ["speed", "distance", "time"],
      response: [
        "Speed tells us how much distance is covered in a given time.",
        "",
        "Formula",
        "speed = distance ÷ time",
        "",
        "Step 1: Write the distance travelled.",
        "Step 2: Write the time taken using compatible units.",
        "Step 3: Divide distance by time.",
        "",
        "Example: 100 m ÷ 20 s = 5 m/s.",
      ].join("\n"),
    },
  ],
  Chemistry: [
    {
      keywords: ["atom"],
      response: [
        "An atom is a tiny unit of an element that keeps that element's properties.",
        "",
        "Step 1: Protons and neutrons are found in the nucleus.",
        "Step 2: Electrons occupy regions around the nucleus.",
        "Step 3: The number of protons identifies the element.",
        "",
        "Example: Every atom with one proton is hydrogen.",
      ].join("\n"),
    },
    {
      keywords: ["states of matter"],
      response: [
        "Three common states of matter are solid, liquid, and gas.",
        "",
        "Step 1: In a solid, particles stay close together and mainly vibrate.",
        "Step 2: In a liquid, particles stay close but can move past one another.",
        "Step 3: In a gas, particles spread out and move freely.",
        "",
        "Example: Ice, liquid water, and water vapour are different states of water.",
      ].join("\n"),
    },
    {
      keywords: ["water", "formula"],
      response: [
        "The chemical formula for water is H₂O.",
        "",
        "Step 1: H represents hydrogen.",
        "Step 2: O represents oxygen.",
        "Step 3: The small 2 means each water molecule has two hydrogen atoms for every one oxygen atom.",
        "",
        "Final Answer: One water molecule contains two hydrogen atoms and one oxygen atom.",
      ].join("\n"),
    },
  ],
  Biology: [
    {
      keywords: ["photosynthesis"],
      response: [
        "Photosynthesis is how plants use light energy to make sugars.",
        "",
        "Word equation",
        "carbon dioxide + water → glucose + oxygen",
        "",
        "Step 1: Roots absorb water, and leaves take in carbon dioxide.",
        "Step 2: Chlorophyll captures energy from sunlight.",
        "Step 3: The plant uses this energy to make glucose and release oxygen.",
        "",
        "Final Answer: Photosynthesis stores light energy in glucose.",
      ].join("\n"),
    },
    {
      keywords: ["food chain"],
      response: [
        "A food chain shows how energy passes between living things.",
        "",
        "Step 1: A producer, such as a plant, makes its own food.",
        "Step 2: A consumer gets energy by eating plants or other animals.",
        "Step 3: Arrows point from the food to the organism that eats it.",
        "",
        "Example: grass → rabbit → fox.",
      ].join("\n"),
    },
    {
      keywords: ["heart"],
      response: [
        "The heart is a muscular organ that pumps blood around the body.",
        "",
        "Step 1: Blood carries oxygen and nutrients to body tissues.",
        "Step 2: The heart's contractions move blood through blood vessels.",
        "Step 3: Blood returns to the heart so it can be pumped around again.",
        "",
        "Final Answer: The heart keeps blood circulating through the body.",
      ].join("\n"),
    },
  ],
  Science: [
    {
      keywords: ["scientific method"],
      response: [
        "A scientific investigation uses evidence to answer a question.",
        "",
        "Step 1: Ask a clear, testable question.",
        "Step 2: Make a prediction and plan a fair test.",
        "Step 3: Record observations or measurements.",
        "Step 4: Use the evidence to explain what happened.",
        "",
        "Tip: Change one factor at a time when testing its effect.",
      ].join("\n"),
    },
    {
      keywords: ["water cycle"],
      response: [
        "The water cycle describes how water moves between Earth's surface and the air.",
        "",
        "Step 1: The Sun warms water, which evaporates into water vapour.",
        "Step 2: Water vapour cools and condenses into tiny droplets in clouds.",
        "Step 3: Water falls as precipitation, such as rain, and returns to land or water.",
        "",
        "Final Answer: Evaporation, condensation, and precipitation are key parts of the water cycle.",
      ].join("\n"),
    },
    {
      keywords: ["force"],
      response: [
        "A force is a push or a pull that can change an object's motion or shape.",
        "",
        "Step 1: Identify what is pushing or pulling the object.",
        "Step 2: Consider the direction of the force.",
        "Step 3: A force can start, stop, speed up, slow down, or turn an object.",
        "",
        "Example: Pushing a stationary toy can make it move.",
      ].join("\n"),
    },
  ],
  English: [
    {
      keywords: ["noun"],
      response: [
        "A noun is a word used to name a person, place, thing, or idea.",
        "",
        "Step 1: Look for a naming word in the sentence.",
        "Step 2: Check whether it names a person, place, thing, or idea.",
        "Step 3: Use the surrounding sentence to confirm its role.",
        "",
        "Example: In “The student reads a book,” student and book are nouns.",
      ].join("\n"),
    },
    {
      keywords: ["tense"],
      response: [
        "Verb tense helps show when an action happens.",
        "",
        "Step 1: Present tense describes an action happening now or regularly.",
        "Step 2: Past tense describes an action that already happened.",
        "Step 3: Future tense describes an action that is expected to happen.",
        "",
        "Example: walk (present), walked (past), will walk (future).",
      ].join("\n"),
    },
    {
      keywords: ["subject", "verb", "agreement"],
      response: [
        "Subject–verb agreement means the verb form matches its subject.",
        "",
        "Step 1: Find the subject of the sentence.",
        "Step 2: Decide whether the subject is singular or plural.",
        "Step 3: Choose a verb form that agrees with it.",
        "",
        "Example: “She reads” but “They read.”",
      ].join("\n"),
    },
  ],
};

function formatNumber(value) {
  return String(Number.isInteger(value) ? value : Number(value.toFixed(6)));
}

function solveLinearEquation(question) {
  const normalized = question.toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(
    /([+-]?(?:\d+(?:\.\d+)?|\.\d+)?)x(?:([+-])((?:\d+(?:\.\d+)?|\.\d+)))?=([+-]?(?:\d+(?:\.\d+)?|\.\d+))/,
  );

  if (!match) {
    return null;
  }

  const [, coefficientText, constantSign, constantText, resultText] = match;
  const coefficient =
    coefficientText === "" || coefficientText === "+"
      ? 1
      : coefficientText === "-"
        ? -1
        : Number(coefficientText);
  const constant =
    constantText === undefined ? 0 : Number(`${constantSign}${constantText}`);
  const result = Number(resultText);

  if (
    !Number.isFinite(coefficient) ||
    coefficient === 0 ||
    !Number.isFinite(constant) ||
    !Number.isFinite(result)
  ) {
    return null;
  }

  const remainder = result - constant;
  const solution = remainder / coefficient;
  return [
    "Given",
    `${match[0].replace(/([+-])/g, " $1 ").replace(/=/g, " = ").replace(/\s+/g, " ").trim()}`,
    "",
    "Formula",
    "For ax + b = c, x = (c − b) ÷ a",
    "",
    "Step 1: Move the constant term to the right side.",
    `${formatNumber(coefficient)}x = ${formatNumber(result)} − (${formatNumber(constant)}) = ${formatNumber(remainder)}`,
    "",
    "Step 2: Divide both sides by the coefficient of x.",
    `x = ${formatNumber(remainder)} ÷ ${formatNumber(coefficient)}`,
    "",
    "Step 3: Calculate the value of x.",
    `x = ${formatNumber(solution)}`,
    "",
    `Final Answer: x = ${formatNumber(solution)}`,
  ].join("\n");
}

export function generateTutorResponse(question, subject) {
  if (subject === "Mathematics") {
    const mathResponse = solveLinearEquation(question);
    if (mathResponse) {
      return mathResponse;
    }
  }

  const normalizedQuestion = question.toLowerCase();
  const subjectExamples = tutorExamples[subject] || [];
  const matchingExample = subjectExamples.find(({ keywords }) =>
    keywords.every((keyword) => normalizedQuestion.includes(keyword)),
  );

  if (matchingExample) {
    return matchingExample.response;
  }

  return [
    "I don't have a matching example for that question in this prototype yet.",
    "",
    "Try a supported topic such as photosynthesis, Newton's second law, Ohm's law, or a simple equation like 2x + 5 = 15.",
    "",
    "This response comes from a small built-in example set, not an AI model.",
  ].join("\n");
}
