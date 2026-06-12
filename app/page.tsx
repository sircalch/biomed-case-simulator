import { ArrowRight, BrainCircuit, ClipboardList, FlaskConical, Target } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getRecommendedCaseId } from "@/lib/case-engine";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const recommendedCaseId = getRecommendedCaseId(params.category);

  if (recommendedCaseId) {
    redirect(`/cases/${recommendedCaseId}?source=quiz&category=${params.category}`);
  }

  const highlights = [
    "5 casos tecnicos iniciales para practica guiada.",
    "Flujo por pasos: reporte, pistas, causa, herramienta, accion y cierre.",
    "Puntuacion automatica con feedback educativo por respuesta.",
  ];

  const flow = [
    "Reporte inicial",
    "Pistas tecnicas",
    "Causa probable",
    "Herramienta",
    "Accion",
    "Contexto",
    "Resultado final",
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.09)]">
          <div className="border-b border-cyan-100 bg-cyan-50 px-6 py-4 md:px-8">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-800">
              <BrainCircuit className="h-4 w-4" aria-hidden="true" />
              BioMed Case Simulator Web
            </p>
          </div>
          <div className="p-6 md:p-8">
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
            Simulador tecnico de fallas en equipos medicos
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Practica razonamiento de ingenieria clinica con casos cortos y
            guiados por etapas.
          </p>
          <section className="mt-6 grid gap-3 rounded-md border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-3">
            <article className="rounded-md border border-cyan-100 bg-white p-3 shadow-sm">
              <BrainCircuit className="h-4 w-4 text-cyan-700" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-slate-900">Diagnostico</p>
              <p className="mt-1 text-xs text-slate-700">
                Toma de decisiones con pistas graduales.
              </p>
            </article>
            <article className="rounded-md border border-cyan-100 bg-white p-3 shadow-sm">
              <ClipboardList className="h-4 w-4 text-cyan-700" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-slate-900">Estructura</p>
              <p className="mt-1 text-xs text-slate-700">
                Siete pasos estables para repetir practica.
              </p>
            </article>
            <article className="rounded-md border border-cyan-100 bg-white p-3 shadow-sm">
              <Target className="h-4 w-4 text-cyan-700" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-slate-900">Resultado</p>
              <p className="mt-1 text-xs text-slate-700">
                Puntaje inmediato con guardado local.
              </p>
            </article>
          </section>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cases"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Iniciar simulador
            </Link>
            <Link
              href="/results"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              Ver ultimo resultado
            </Link>
          </div>
          <section className="mt-7 rounded-md border border-slate-200 bg-slate-50/80 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Flujo operativo
            </h2>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {flow.map((step, index) => (
                <li key={step} className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{index + 1}.</span>{" "}
                  {step}
                </li>
              ))}
            </ol>
          </section>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
          <header className="border-b border-white/10 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Incluye
            </h2>
          </header>
          <ul className="divide-y divide-white/10 text-sm text-slate-200">
            {highlights.map((item) => (
              <li key={item} className="px-6 py-3">
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/results"
            className="mx-6 mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-cyan-200/30 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15"
          >
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Ver ultimo resultado
          </Link>
        </section>
      </main>
    </div>
  );
}
