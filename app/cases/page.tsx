import Link from "next/link";

import { CaseCard } from "@/components/CaseCard";
import { SimulationStatsPanel } from "@/components/SimulationStatsPanel";
import { getAllCases } from "@/lib/case-engine";

export default function CasesPage() {
  const scenarios = getAllCases();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Casos
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Banco inicial de simulaciones
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Selecciona un caso y resuelve la falla siguiendo el flujo de
            diagnostico por pasos.
          </p>
        </header>

        <div className="mb-6">
          <SimulationStatsPanel />
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {scenarios.map((scenario) => (
            <CaseCard key={scenario.id} scenario={scenario} />
          ))}
        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
