import { CaseEvaluation } from "@/types/case";

export type SimulationRun = {
  id: string;
  caseId: string;
  caseTitle: string;
  equipment: string;
  traineeAlias: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  verdict: CaseEvaluation["verdict"];
  completedAt: string;
};

type StorageSource = "supabase" | "memory";

const memoryRuns: SimulationRun[] = [];
const VALID_VERDICTS: SimulationRun["verdict"][] = [
  "Excelente",
  "Solido",
  "En desarrollo",
];

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toIsoDate(value: unknown): string {
  const raw = asString(value);
  if (!raw) {
    return new Date().toISOString();
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function pick(
  record: Record<string, unknown>,
  candidates: string[],
): unknown {
  for (const key of candidates) {
    if (key in record) {
      return record[key];
    }
  }
  return undefined;
}

function normalizeRun(raw: unknown): SimulationRun | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;

  const id =
    asString(pick(source, ["id", "external_id"])) ?? crypto.randomUUID();
  const caseId = asString(pick(source, ["caseId", "case_id"]));
  const caseTitle = asString(pick(source, ["caseTitle", "case_title"]));
  const equipment = asString(pick(source, ["equipment"]));
  const traineeAlias =
    asString(pick(source, ["traineeAlias", "trainee_alias"])) ?? "Invitado";
  const score = asNumber(pick(source, ["score"]));
  const maxScore = asNumber(pick(source, ["maxScore", "max_score"]));
  const correctCount = asNumber(pick(source, ["correctCount", "correct_count"]));
  const totalQuestions = asNumber(
    pick(source, ["totalQuestions", "total_questions"]),
  );
  const verdictRaw = asString(pick(source, ["verdict"]));
  const completedAt = toIsoDate(pick(source, ["completedAt", "completed_at"]));

  if (
    !caseId ||
    !caseTitle ||
    !equipment ||
    score === null ||
    maxScore === null ||
    correctCount === null ||
    totalQuestions === null ||
    !verdictRaw ||
    !VALID_VERDICTS.includes(verdictRaw as SimulationRun["verdict"])
  ) {
    return null;
  }

  return {
    id,
    caseId,
    caseTitle,
    equipment,
    traineeAlias,
    score,
    maxScore,
    correctCount,
    totalQuestions,
    verdict: verdictRaw as SimulationRun["verdict"],
    completedAt,
  };
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const runsTable = process.env.SUPABASE_CASE_RUNS_TABLE ?? "simulation_runs";

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return { supabaseUrl, serviceRoleKey, runsTable };
}

async function listSupabaseRuns(limit: number): Promise<SimulationRun[] | null> {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  try {
    const endpoint = new URL(`/rest/v1/${config.runsTable}`, config.supabaseUrl);
    endpoint.searchParams.set("select", "*");
    endpoint.searchParams.set("order", "completed_at.desc");
    endpoint.searchParams.set("limit", String(limit));

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      return null;
    }

    return payload
      .map((item) => normalizeRun(item))
      .filter((item): item is SimulationRun => item !== null);
  } catch {
    return null;
  }
}

async function insertSupabaseRun(run: SimulationRun): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) {
    return false;
  }

  try {
    const endpoint = new URL(`/rest/v1/${config.runsTable}`, config.supabaseUrl);
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify([
        {
          external_id: run.id,
          case_id: run.caseId,
          case_title: run.caseTitle,
          equipment: run.equipment,
          trainee_alias: run.traineeAlias,
          score: run.score,
          max_score: run.maxScore,
          correct_count: run.correctCount,
          total_questions: run.totalQuestions,
          verdict: run.verdict,
          completed_at: run.completedAt,
        },
      ]),
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function listSimulationRuns(limit = 25): Promise<{
  source: StorageSource;
  runs: SimulationRun[];
}> {
  const safeLimit = Math.max(1, Math.min(limit, 500));
  const supabaseRuns = await listSupabaseRuns(safeLimit);

  if (supabaseRuns) {
    return {
      source: "supabase",
      runs: supabaseRuns,
    };
  }

  return {
    source: "memory",
    runs: [...memoryRuns]
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      )
      .slice(0, safeLimit),
  };
}

export async function addSimulationRun(input: unknown): Promise<{
  ok: boolean;
  storage: StorageSource;
  run?: SimulationRun;
  error?: string;
}> {
  const parsed = normalizeRun(input);
  if (!parsed) {
    return {
      ok: false,
      storage: "memory",
      error: "Formato de corrida invalido.",
    };
  }

  const inserted = await insertSupabaseRun(parsed);
  if (inserted) {
    return {
      ok: true,
      storage: "supabase",
      run: parsed,
    };
  }

  memoryRuns.push(parsed);
  return {
    ok: true,
    storage: "memory",
    run: parsed,
  };
}

export function buildSimulationStats(runs: SimulationRun[]) {
  const attempts = runs.length;

  if (attempts === 0) {
    return {
      attempts: 0,
      averageScorePercent: 0,
      averageAccuracyPercent: 0,
      bestScorePercent: 0,
      verdicts: {
        Excelente: 0,
        Solido: 0,
        "En desarrollo": 0,
      } as Record<SimulationRun["verdict"], number>,
      topCases: [] as Array<{
        caseId: string;
        caseTitle: string;
        attempts: number;
        averageScorePercent: number;
      }>,
    };
  }

  let scorePercentAccumulator = 0;
  let accuracyPercentAccumulator = 0;
  let bestScorePercent = 0;
  const verdicts: Record<SimulationRun["verdict"], number> = {
    Excelente: 0,
    Solido: 0,
    "En desarrollo": 0,
  };

  const caseMap = new Map<
    string,
    { caseId: string; caseTitle: string; attempts: number; scorePercentSum: number }
  >();

  for (const run of runs) {
    const scorePercent = run.maxScore > 0 ? (run.score / run.maxScore) * 100 : 0;
    const accuracyPercent =
      run.totalQuestions > 0 ? (run.correctCount / run.totalQuestions) * 100 : 0;

    scorePercentAccumulator += scorePercent;
    accuracyPercentAccumulator += accuracyPercent;
    bestScorePercent = Math.max(bestScorePercent, scorePercent);
    verdicts[run.verdict] += 1;

    const bucket = caseMap.get(run.caseId) ?? {
      caseId: run.caseId,
      caseTitle: run.caseTitle,
      attempts: 0,
      scorePercentSum: 0,
    };
    bucket.attempts += 1;
    bucket.scorePercentSum += scorePercent;
    caseMap.set(run.caseId, bucket);
  }

  const topCases = [...caseMap.values()]
    .map((item) => ({
      caseId: item.caseId,
      caseTitle: item.caseTitle,
      attempts: item.attempts,
      averageScorePercent: Number(
        (item.scorePercentSum / item.attempts).toFixed(1),
      ),
    }))
    .sort((a, b) => {
      if (b.averageScorePercent !== a.averageScorePercent) {
        return b.averageScorePercent - a.averageScorePercent;
      }
      return b.attempts - a.attempts;
    })
    .slice(0, 6);

  return {
    attempts,
    averageScorePercent: Number((scorePercentAccumulator / attempts).toFixed(1)),
    averageAccuracyPercent: Number(
      (accuracyPercentAccumulator / attempts).toFixed(1),
    ),
    bestScorePercent: Number(bestScorePercent.toFixed(1)),
    verdicts,
    topCases,
  };
}
