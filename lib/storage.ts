import { StoredCaseResult } from "@/types/case";

const LAST_RESULT_KEY = "biomed-case-simulator:last-result";

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

export function saveLastResult(result: StoredCaseResult): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result));
}

export function loadLastResult(): StoredCaseResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseResult(window.localStorage.getItem(LAST_RESULT_KEY));
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
