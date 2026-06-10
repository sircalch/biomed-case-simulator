"use client";

import { BarChart3, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

type TopCase = {
  caseId: string;
  caseTitle: string;
  attempts: number;
  averageScorePercent: number;
};

type SimulationStats = {
  attempts: number;
  averageScorePercent: number;
  averageAccuracyPercent: number;
  bestScorePercent: number;
  verdicts: {
    Excelente: number;
    Solido: number;
    "En desarrollo": number;
  };
  topCases: TopCase[];
};

export function SimulationStatsPanel() {
  const [stats, setStats] = useState<SimulationStats | null>(null);
  const [source, setSource] = useState<"memory" | "supabase" | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");

  const loadStats = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/simulations/stats", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("No fue posible cargar metricas.");
      }

      const payload = (await response.json()) as {
        source?: "memory" | "supabase";
        stats?: SimulationStats;
      };

      if (!payload.stats) {
        throw new Error("Metricas incompletas.");
      }

      setStats(payload.stats);
      setSource(payload.source ?? "memory");
      setStatus("idle");
    } catch {
      setStatus("error");
      setStats(null);
      setSource(null);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStats();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          Telemetria de entrenamiento
        </h2>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="inline-flex min-h-8 items-center gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {status === "loading" ? (
        <p className="mt-3 text-sm text-slate-600">Cargando metricas globales...</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          No se pudo cargar la telemetria en este momento.
        </p>
      ) : null}
      {stats ? (
        <div className="mt-3 space-y-3">
          <div className="grid gap-2 sm:grid-cols-4">
            <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Intentos</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{stats.attempts}</p>
            </article>
            <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Promedio</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {stats.averageScorePercent}%
              </p>
            </article>
            <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Precision</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {stats.averageAccuracyPercent}%
              </p>
            </article>
            <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Mejor puntaje
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {stats.bestScorePercent}%
              </p>
            </article>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Excelente: {stats.verdicts.Excelente}
            </p>
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Solido: {stats.verdicts.Solido}
            </p>
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              En desarrollo: {stats.verdicts["En desarrollo"]}
            </p>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Casos con mejor desempeno promedio
            </h3>
            {stats.topCases.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">Aun no hay corridas registradas.</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {stats.topCases.map((item) => (
                  <li key={item.caseId} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{item.caseTitle}</span>
                    <span>
                      {item.averageScorePercent}% ({item.attempts} intentos)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Fuente de datos: {source ?? "N/D"}
          </p>
          {source === "memory" ? (
            <p className="text-xs text-slate-600">
              Modo memoria: en Vercel no garantiza persistencia entre invocaciones.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
