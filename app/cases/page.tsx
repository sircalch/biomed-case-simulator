import { Clock3, FlaskConical, ListChecks, Target } from "lucide-react";
import Link from "next/link";

import { CaseCard } from "@/components/CaseCard";
import { SimulationStatsPanel } from "@/components/SimulationStatsPanel";
import { getAllCases } from "@/lib/case-engine";

export default function CasesPage() {
  const scenarios = getAllCases();
  const totalMinutes = scenarios.reduce(
    (acc, scenario) => acc + scenario.estimatedMinutes,
    0,
  );
  const intermediateCases = scenarios.filter(
    (scenario) => scenario.difficulty === "Intermedio",
  ).length;

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700">
                  <FlaskConical className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    Banco de simulaciones
                  </p>
                  <h1 className="text-3xl font-semibold text-slate-950">
                    Selecciona un caso tecnico
                  </h1>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                Cada caso sigue el mismo flujo de diagnostico por pasos para
                comparar desempeno, reforzar criterio tecnico y generar
                evidencia documentable.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/cases/monitor-sin-spo2"
                  className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  Abrir caso piloto
                </Link>
                <Link
                  href="/results"
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Ver resultados
                </Link>
              </div>
            </div>

            <section className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: "Casos activos", value: scenarios.length, icon: ListChecks },
                { label: "Tiempo estimado", value: `${totalMinutes} min`, icon: Clock3 },
                { label: "Intermedios", value: intermediateCases, icon: Target },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-md border border-slate-200 bg-white p-3"
                >
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <item.icon className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-950">
                    {item.value}
                  </p>
                </article>
              ))}
            </section>
          </div>
        </header>

        <section className="mt-6">
          <SimulationStatsPanel />
        </section>

        <section className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Casos disponibles
            </h2>
            <p className="text-sm text-slate-500">
              Elige un escenario y resuelve decisiones tecnicas.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map((scenario) => (
              <CaseCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
