import { StoredCaseResult } from "@/types/case";

const LAST_RESULT_KEY = "biomed-case-simulator:last-result";
const RESULT_HISTORY_KEY = "biomed-case-simulator:result-history:v2";
const CASE_NOTES_KEY = "biomed-case-simulator:case-notes:v1";
const HISTORY_LIMIT = 30;

function parseResult(raw: string | null): StoredCaseResult | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredCaseResult;
    if (!parsed.caseId || !parsed.evaluation) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function parseHistory(raw: string | null): StoredCaseResult[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is StoredCaseResult => {
      if (!item || typeof item !== "object") {
        return false;
      }
      const candidate = item as Partial<StoredCaseResult>;
      return Boolean(candidate.caseId && candidate.caseTitle && candidate.evaluation);
    });
  } catch {
    return [];
  }
}

function readCaseNotes(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CASE_NOTES_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveLastResult(result: StoredCaseResult): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result));
    const history = parseHistory(window.localStorage.getItem(RESULT_HISTORY_KEY));
    const nextHistory = [result, ...history].slice(0, HISTORY_LIMIT);
    window.localStorage.setItem(RESULT_HISTORY_KEY, JSON.stringify(nextHistory));
  } catch {
    // localStorage can fail in private mode or when quota is unavailable.
  }
}

export function loadLastResult(): StoredCaseResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseResult(window.localStorage.getItem(LAST_RESULT_KEY));
}

export function loadResultHistory(): StoredCaseResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseHistory(window.localStorage.getItem(RESULT_HISTORY_KEY));
}

export function clearResultHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(RESULT_HISTORY_KEY);
    window.localStorage.removeItem(LAST_RESULT_KEY);
  } catch {
    // localStorage can fail in private mode or when disabled.
  }
}

export function loadCaseNotes(caseId: string): string {
  return readCaseNotes()[caseId] ?? "";
}

export function saveCaseNotes(caseId: string, notes: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = readCaseNotes();
    const trimmedNotes = notes.trim();
    if (trimmedNotes) {
      current[caseId] = trimmedNotes;
    } else {
      delete current[caseId];
    }
    window.localStorage.setItem(CASE_NOTES_KEY, JSON.stringify(current));
  } catch {
    // localStorage can fail in private mode or when quota is unavailable.
  }
}

export function getLastResultSnapshot(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(LAST_RESULT_KEY) ?? "";
}

export function getLastResultServerSnapshot(): string {
  return "";
}

export function subscribeLastResult(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = (event: StorageEvent) => {
    if (event.key && event.key !== LAST_RESULT_KEY) {
      return;
    }
    onStoreChange();
  };

  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

export function fromResultSnapshot(snapshot: string): StoredCaseResult | null {
  return parseResult(snapshot);
}
