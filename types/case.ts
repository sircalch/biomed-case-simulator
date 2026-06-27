export const QUESTION_KEYS = ["cause", "tool", "action", "context"] as const;

export type CaseQuestionKey = (typeof QUESTION_KEYS)[number];

export type SimulationStepId =
  | "report"
  | "clues"
  | "cause"
  | "tool"
  | "action"
  | "context"
  | "result";

export type SimulationStep = {
  id: SimulationStepId;
  label: string;
  questionKey?: CaseQuestionKey;
};

export type DifficultyLevel = "Basico" | "Intermedio";

export type QuestionOption = {
  id: string;
  label: string;
  explanation: string;
};

export type QuestionSet = {
  prompt: string;
  options: QuestionOption[];
};

export type CaseQuestionSets = Record<CaseQuestionKey, QuestionSet>;

export type CaseCorrectAnswers = Record<CaseQuestionKey, string>;

export type CaseScenario = {
  id: string;
  title: string;
  equipment: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  initialReport: string;
  clues: string[];
  questionSets: CaseQuestionSets;
  correctAnswers: CaseCorrectAnswers;
  finalResolution: string;
  learningPoints: string[];
};

export type CaseAnswerMap = Record<CaseQuestionKey, string>;

export type CaseEvaluationDetail = {
  key: CaseQuestionKey;
  prompt: string;
  selectedId: string;
  selectedLabel: string;
  correctId: string;
  correctLabel: string;
  explanation: string;
  isCorrect: boolean;
};

export type CaseEvaluation = {
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  details: CaseEvaluationDetail[];
  verdict: "Excelente" | "Solido" | "En desarrollo";
};

export type StoredCaseResult = {
  caseId: string;
  caseTitle: string;
  equipment: string;
  completedAt: string;
  traineeAlias?: string;
  notes?: string;
  evaluation: CaseEvaluation;
};
