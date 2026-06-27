import Link from "next/link";

import { CaseHistoryClient } from "@/components/CaseHistoryClient";
import { LatestResultClient } from "@/components/LatestResultClient";
import { SimulationStatsPanel } from "@/components/SimulationStatsPanel";

export default function ResultsPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <header className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Resultados y evidencia
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-slate-950 md:text-4xl">
            Seguimiento local de casos simulados
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Revisa el ultimo resultado, exporta historial y conserva evidencia
            para una actividad piloto o practica docente.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <LatestResultClient />
          <SimulationStatsPanel />
        </div>

        <div className="mt-5">
          <CaseHistoryClient />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/cases"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Ver casos
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
