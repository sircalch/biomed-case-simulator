import {
  ArrowRight,
  BrainCircuit,
  ClipboardList,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700">
                  <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    BioMedTools MX Core
                  </p>
                  <h1 className="text-3xl font-semibold text-slate-950">
                    BioMed Case Simulator
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                Simulador educativo para entrenar razonamiento tecnico en
                fallas de equipos medicos mediante escenarios guiados,
                decisiones por etapas y retroalimentacion formativa.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/cases"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                >
                  Explorar casos
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/results"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Ver resultados
                </Link>
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-blue-950 p-5 text-white lg:border-l lg:border-t-0 md:p-7">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-100">
                Uso educativo
              </h2>
              <p className="mt-3 text-sm leading-6 text-blue-100">
                Esta herramienta apoya actividades academicas de ingenieria
                biomedica y ciencias de la salud. No sustituye protocolos
                institucionales, mantenimiento certificado ni supervision
                profesional.
              </p>

              <div className="mt-5 grid gap-3">
                {[
                  {
                    title: "Practica",
                    body: "Casos cortos con pistas y decisiones tecnicas.",
                    icon: ClipboardList,
                  },
                  {
                    title: "Seguridad",
                    body: "Enfoque en criterio tecnico y documentacion sin datos sensibles.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Evidencia",
                    body: "El resultado puede conectarse con Report Builder.",
                    icon: FileText,
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="rounded-md border border-white/10 bg-white/[0.05] p-3"
                  >
                    <item.icon className="h-4 w-4 text-cyan-100" aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-100">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
