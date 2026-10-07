const rejectionMessage =
  "Sorry, I can currently help only with the supported school curriculum.";

const harmfulRequestPatterns = [
  /\b(write|create|build|make|develop|deploy|code)\b.*\b(malware|ransomware|virus|keylogger|botnet|credential stealer)\b/i,
  /\b(hack|break into|steal passwords|bypass security|exploit a vulnerability)\b/i,
  /\b(malware|ransomware|keylogger|botnet)\b/i,
];

const currentEventsPatterns = [
  /\b(today'?s?|current|latest|live|real[- ]time)\b.*\b(news|headlines?|stock|share|crypto|bitcoin|market price|price)\b/i,
  /\b(stock|share|crypto|bitcoin)\b.*\b(price|quote|today|latest|current)\b/i,
  /\b(latest|breaking)\s+news\b/i,
];

const curriculumKeywords = {
  Mathematics: [
    /\b(math|mathematics|algebra|equation|solve|calculate|number|fraction|decimal|percent|percentage|ratio|proportion|geometry|triangle|circle|area|perimeter|volume|angle|multipli(?:cation|cation)|divide|addition|subtract|factor|x\s*[=+\-*/])\b/i,
    /\b\d+(?:\.\d+)?\s*[+\-*/×÷=]\s*\d+/,
  ],
  Physics: [
    /\b(physics|force|motion|newton|acceleration|velocity|speed|distance|time|energy|power|work|gravity|mass|weight|friction|electricity|voltage|current|resistance|ohm|wave|light|sound|magnet|pressure|density|circuit)\b/i,
  ],
  Chemistry: [
    /\b(chemistry|atom|element|molecule|proton|neutron|electron|periodic table|chemical|reaction|compound|mixture|acid|base|alkali|bond|matter|solid|liquid|gas|water|oxygen|hydrogen|carbon|formula)\b/i,
  ],
  Biology: [
    /\b(biology|photosynthesis|plant|animal|cell|organ|heart|blood|body|organism|ecosystem|habitat|food chain|food web|species|reproduction|digestion|respiration|evolution|gene|bacteria|fungus|life cycle|nutrition)\b/i,
  ],
  Science: [
    /\b(science|scientific|experiment|investigation|hypothesis|observation|evidence|water cycle|evaporation|condensation|precipitation|weather|climate|force|energy|matter|planet|solar system|earth|environment|recycling|electricity|magnet|light|sound|heat|temperature|measurement)\b/i,
  ],
  English: [
    /\b(english|grammar|noun|verb|adjective|adverb|pronoun|sentence|punctuation|spelling|vocabulary|synonym|antonym|tense|subject[- ]verb agreement|paragraph|reading|writing|metaphor|simile|story|poem|comprehension)\b/i,
  ],
};

export function checkCurriculumSafety(question, subject) {
  if (harmfulRequestPatterns.some((pattern) => pattern.test(question))) {
    return { allowed: false, reason: "harmful-request" };
  }

  if (currentEventsPatterns.some((pattern) => pattern.test(question))) {
    return { allowed: false, reason: "current-events-or-financial-data" };
  }

  const supportedPatterns = curriculumKeywords[subject] || [];
  const allowed = supportedPatterns.some((pattern) => pattern.test(question));

  return {
    allowed,
    reason: allowed ? "supported-curriculum" : "outside-supported-curriculum",
  };
}

export function getCurriculumRejectionMessage() {
  return rejectionMessage;
}
