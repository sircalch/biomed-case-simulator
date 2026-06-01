"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  fromResultSnapshot,
  getLastResultServerSnapshot,
  getLastResultSnapshot,
  subscribeLastResult,
} from "@/lib/storage";

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

export function LatestResultClient() {
  const snapshot = useSyncExternalStore(
    subscribeLastResult,
    getLastResultSnapshot,
    getLastResultServerSnapshot,
  );
  const result = fromResultSnapshot(snapshot);

  if (!result) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Sin resultados guardados
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          Completa un caso para generar reporte final y guardarlo localmente.
        </p>
        <Link
          href="/cases"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Ir a casos
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Ultimo resultado guardado
      </h2>
      <p className="mt-2 text-sm text-slate-700">{result.caseTitle}</p>
      <p className="text-sm text-slate-700">{result.equipment}</p>
      <p className="text-sm text-slate-600">
        Completado: {formatDate(result.completedAt)}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Puntaje</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {result.evaluation.score}/{result.evaluation.maxScore}
          </p>
        </article>
        <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Correctas
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {result.evaluation.correctCount}/{result.evaluation.totalQuestions}
          </p>
        </article>
        <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Nivel
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {result.evaluation.verdict}
          </p>
        </article>
      </div>

      <Link
        href={`/cases/${result.caseId}`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Repetir caso
      </Link>
    </section>
  );
}
