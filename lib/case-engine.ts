import rawCases from "@/data/cases.json";
import {
  CaseQuestionKey,
  CaseScenario,
  QUESTION_KEYS,
  SimulationStep,
  SimulationStepId,
} from "@/types/case";

export const SIMULATION_STEPS: SimulationStep[] = [
  { id: "report", label: "Reporte Inicial" },
  { id: "clues", label: "Pistas Tecnicas" },
  { id: "cause", label: "Causa Probable", questionKey: "cause" },
  { id: "tool", label: "Herramienta", questionKey: "tool" },
  { id: "action", label: "Accion", questionKey: "action" },
  { id: "context", label: "Pregunta Contextual", questionKey: "context" },
  { id: "result", label: "Resultado Final" },
];

const scenarios = rawCases as CaseScenario[];

export function getAllCases(): CaseScenario[] {
  return scenarios;
}

export function getCaseById(caseId: string): CaseScenario | undefined {
  return scenarios.find((caseItem) => caseItem.id === caseId);
}

export function getQuestionKeyForStep(
  stepId: SimulationStepId,
): CaseQuestionKey | null {
  const step = SIMULATION_STEPS.find((item) => item.id === stepId);
  return step?.questionKey ?? null;
}

export function getStepIndex(stepId: SimulationStepId): number {
  return SIMULATION_STEPS.findIndex((item) => item.id === stepId);
}

export function getInitialAnswerMap(): Record<CaseQuestionKey, string> {
  return QUESTION_KEYS.reduce(
    (acc, key) => {
      acc[key] = "";
      return acc;
    },
    {} as Record<CaseQuestionKey, string>,
  );
}
