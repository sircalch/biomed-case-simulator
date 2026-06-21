import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ClipboardList,
  FlaskConical,
  ShieldCheck,
  Target,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAllCases, getRecommendedCaseId } from "@/lib/case-engine";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const QUIZ_ARENA_URL =
  process.env.NEXT_PUBLIC_QUIZ_ARENA_URL ??
  "https://biomed-quiz-arena.vercel.app";
const REPORT_BUILDER_URL =
  process.env.NEXT_PUBLIC_REPORT_BUILDER_URL ??
  "https://clinical-report-builder.vercel.app";

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const recommendedCaseId = getRecommendedCaseId(params.category);

  if (recommendedCaseId) {
    redirect(`/cases/${recommendedCaseId}?source=quiz&category=${params.category}`);
  }

  const scenarios = getAllCases();
  const totalMinutes = scenarios.reduce(
    (acc, scenario) => acc + scenario.estimatedMinutes,
    0,
  );

  const metrics = [
    { label: "Casos", value: scenarios.length, icon: ClipboardList },
    { label: "Tiempo total", value: `${totalMinutes} min`, icon: Timer },
    { label: "Pasos", value: "7", icon: Target },
    { label: "Salida", value: "Reporte", icon: ShieldCheck },
  ];

  const flow = [
    "Reporte inicial",
    "Pistas tecnicas",
    "Causa probable",
    "Herramienta",
    "Accion",
    "Pregunta contextual",
    "Resultado final",
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700">
                  <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    BioMed Case Simulator
                  </p>
                  <p className="text-sm text-slate-500">
                    Simulacion tecnica por pasos
                  </p>
                </div>
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Practica diagnostico tecnico en fallas de equipos medicos
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Resuelve casos cortos con pistas, decisiones tecnicas,
                feedback y cierre documentable para actividades de laboratorio
                o clase.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/cases"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  Abrir banco de casos
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={`${QUIZ_ARENA_URL}/quiz/monitoreo-signos-vitales?mode=study&difficulty=intermediate`}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
                >
                  Repasar antes del caso
                </a>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-md border border-slate-200 bg-slate-50/80 p-3"
                  >
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <item.icon className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {item.value}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-blue-950 p-5 text-white lg:border-l lg:border-t-0 md:p-7">
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Caso piloto
                </h2>
                <p className="mt-3 text-2xl font-semibold leading-tight">
                  Monitor sin lectura de SpO2
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Ruta preparada para validar el flujo completo con alumnos:
                  quiz, caso diagnostico y reporte.
                </p>
                <div className="mt-4 grid gap-2">
                  <Link
                    href="/cases/monitor-sin-spo2"
                    className="inline-flex min-h-10 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
                  >
                    Abrir caso sugerido
                  </Link>
                  <a
                    href={`${REPORT_BUILDER_URL}/builder/corrective?activity=case&caseId=monitor-sin-spo2&equipment=Monitor%20multiparametrico`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Crear reporte del caso
                  </a>
                </div>
              </div>

              <ol className="mt-4 grid gap-2">
                {flow.map((step, index) => (
                  <li
                    key={step}
                    className="flex min-h-9 items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-blue-100"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-semibold text-cyan-100">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {scenarios.slice(0, 3).map((scenario) => (
            <Link
              key={scenario.id}
              href={`/cases/${scenario.id}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
            >
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Practica sugerida
              </p>
              <h2 className="mt-3 text-lg font-semibold text-slate-950">
                {scenario.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {scenario.equipment} - {scenario.estimatedMinutes} min
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
