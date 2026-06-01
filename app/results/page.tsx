import Link from "next/link";

import { LatestResultClient } from "@/components/LatestResultClient";
import { SimulationStatsPanel } from "@/components/SimulationStatsPanel";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Resultados
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Reporte final guardado
          </h1>
        </header>

        <LatestResultClient />
        <div className="mt-5">
          <SimulationStatsPanel />
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
