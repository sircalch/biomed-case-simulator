"use client";

import {
  BarChart3,
  Download,
  FileJson,
  FileSpreadsheet,
  History,
  RotateCcw,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { clearResultHistory, loadResultHistory } from "@/lib/storage";
import { StoredCaseResult } from "@/types/case";

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Fecha no disponible";
  }

  return parsed.toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scorePercent(result: StoredCaseResult) {
  const { score, maxScore } = result.evaluation;
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
}

function exportJson(history: StoredCaseResult[]) {
  downloadBlob(
    "biomed-case-simulator-historial.json",
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        source: "BioMed Case Simulator",
        history,
      },
      null,
      2,
    ),
    "application/json;charset=utf-8",
  );
}

function exportCsv(history: StoredCaseResult[]) {
  const rows = [
    [
      "fecha",
      "caso",
      "equipo",
      "alias",
      "puntaje",
      "maximo",
      "porcentaje",
      "correctas",
      "total_preguntas",
      "nivel",
    ],
    ...history.map((item) => [
      item.completedAt,
      item.caseTitle,
      item.equipment,
      item.traineeAlias ?? "",
      String(item.evaluation.score),
      String(item.evaluation.maxScore),
      String(scorePercent(item)),
      String(item.evaluation.correctCount),
      String(item.evaluation.totalQuestions),
      item.evaluation.verdict,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  downloadBlob("biomed-case-simulator-historial.csv", csv, "text/csv;charset=utf-8");
}

export function CaseHistoryClient() {
  const [history, setHistory] = useState<StoredCaseResult[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(loadResultHistory());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const attempts = history.length;
    const bestScore = history.reduce(
      (best, item) => Math.max(best, scorePercent(item)),
      0,
    );
    const average =
      attempts > 0
        ? Math.round(
            history.reduce((total, item) => total + scorePercent(item), 0) / attempts,
          )
        : 0;
    const completedCases = new Set(history.map((item) => item.caseId)).size;

    return { attempts, bestScore, average, completedCases };
  }, [history]);
  const statCards: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
  }> = [
    { label: "Intentos", value: stats.attempts, icon: BarChart3 },
    { label: "Casos distintos", value: stats.completedCases, icon: History },
    { label: "Promedio", value: `${stats.average}%`, icon: Download },
    { label: "Mejor puntaje", value: `${stats.bestScore}%`, icon: Trophy },
  ];

  function handleClear() {
    clearResultHistory();
    setHistory([]);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-700">
            <History className="h-4 w-4" aria-hidden="true" />
            Historial local
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Intentos recientes del simulador
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Se guarda en este navegador para evidencia rapida del piloto. El backend
            unificado puede reemplazarlo cuando Supabase quede activo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportJson(history)}
            disabled={history.length === 0}
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileJson className="h-4 w-4" aria-hidden="true" />
            JSON
          </button>
          <button
            type="button"
            onClick={() => exportCsv(history)}
            disabled={history.length === 0}
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            CSV
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={history.length === 0}
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpiar
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-md border border-slate-200 bg-slate-50 p-3"
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Icon className="h-4 w-4 text-cyan-700" aria-hidden="true" />
              {label}
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {String(value)}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {history.slice(0, 8).map((item) => (
          <article
            key={`${item.completedAt}-${item.caseId}`}
            className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="text-sm font-semibold text-slate-950">{item.caseTitle}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.equipment} | {formatDate(item.completedAt)}
              </p>
              {item.notes ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {item.notes}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="rounded-md border border-cyan-100 bg-white px-2.5 py-1 text-sm font-semibold text-cyan-800">
                {scorePercent(item)}%
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-semibold text-slate-700">
                {item.evaluation.verdict}
              </span>
              <Link
                href={`/cases/${item.caseId}`}
                className="inline-flex min-h-9 items-center rounded-md bg-cyan-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-800"
              >
                Repetir
              </Link>
            </div>
          </article>
        ))}

        {history.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            Aun no hay intentos guardados en este navegador.
          </div>
        ) : null}
      </div>
    </section>
  );
}
