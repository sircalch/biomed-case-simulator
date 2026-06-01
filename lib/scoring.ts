import {
  CaseAnswerMap,
  CaseEvaluation,
  CaseEvaluationDetail,
  CaseQuestionKey,
  CaseScenario,
  QUESTION_KEYS,
} from "@/types/case";

export const POINTS_PER_QUESTION = 25;

function getOptionLabel(
  scenario: CaseScenario,
  key: CaseQuestionKey,
  optionId: string,
): string {
  const option = scenario.questionSets[key].options.find(
    (item) => item.id === optionId,
  );
  return option ? option.label : "Sin respuesta";
}

function getOptionExplanation(
  scenario: CaseScenario,
  key: CaseQuestionKey,
  optionId: string,
): string {
  const option = scenario.questionSets[key].options.find(
    (item) => item.id === optionId,
  );
  return option
    ? option.explanation
    : "No se registro seleccion para esta etapa.";
}

function getVerdict(score: number): CaseEvaluation["verdict"] {
  if (score >= 90) {
    return "Excelente";
  }
  if (score >= 65) {
    return "Solido";
  }
  return "En desarrollo";
}

export function evaluateCaseAnswers(
  scenario: CaseScenario,
  answers: CaseAnswerMap,
): CaseEvaluation {
  const details: CaseEvaluationDetail[] = QUESTION_KEYS.map((key) => {
    const correctId = scenario.correctAnswers[key];
    const selectedId = answers[key] ?? "";
    const isCorrect = selectedId === correctId;

    return {
      key,
      prompt: scenario.questionSets[key].prompt,
      selectedId,
      selectedLabel: getOptionLabel(scenario, key, selectedId),
      correctId,
      correctLabel: getOptionLabel(scenario, key, correctId),
      explanation: getOptionExplanation(scenario, key, selectedId),
      isCorrect,
    };
  });

  const correctCount = details.filter((item) => item.isCorrect).length;
  const score = correctCount * POINTS_PER_QUESTION;
  const maxScore = QUESTION_KEYS.length * POINTS_PER_QUESTION;

  return {
    score,
    maxScore,
    correctCount,
    totalQuestions: QUESTION_KEYS.length,
    details,
    verdict: getVerdict(score),
  };
}
