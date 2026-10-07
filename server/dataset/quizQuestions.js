const quizQuestions = [
  {
    id: "math-linear-01",
    subject: "Mathematics",
    prompt: "If 3x = 18, what is the value of x?",
    options: ["3", "6", "9", "15"],
    answerIndex: 1,
    explanation: "Divide both sides by 3: x = 18 ÷ 3 = 6.",
  },
  {
    id: "physics-force-01",
    subject: "Physics",
    prompt: "A 2 kg object accelerates at 4 m/s². What is the net force?",
    options: ["2 N", "6 N", "8 N", "16 N"],
    answerIndex: 2,
    explanation: "Newton's second law gives F = m × a = 2 × 4 = 8 N.",
  },
  {
    id: "chem-water-01",
    subject: "Chemistry",
    prompt: "How many hydrogen atoms are in one H₂O molecule?",
    options: ["One", "Two", "Three", "Four"],
    answerIndex: 1,
    explanation: "The subscript 2 after H means there are two hydrogen atoms.",
  },
  {
    id: "bio-plant-01",
    subject: "Biology",
    prompt: "Which gas do plants take in from the air during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answerIndex: 2,
    explanation: "Plants use carbon dioxide and water to make sugars during photosynthesis.",
  },
  {
    id: "science-cycle-01",
    subject: "Science",
    prompt: "What is the change from liquid water to water vapour called?",
    options: ["Freezing", "Condensation", "Evaporation", "Melting"],
    answerIndex: 2,
    explanation: "Evaporation occurs when liquid water changes into water vapour.",
  },
  {
    id: "english-noun-01",
    subject: "English",
    prompt: "Which word is a noun in this sentence: “The bird sings”?",
    options: ["The", "bird", "sings", "quickly"],
    answerIndex: 1,
    explanation: "Bird names an animal, so it is a noun.",
  },
];

export default quizQuestions;
