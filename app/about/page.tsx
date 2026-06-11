import { ExternalLink, FlaskConical } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Acerca
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            BioMed Case Simulator Web
          </h1>
          <p className="mt-4 text-slate-700">
            Esta version inicial entrena razonamiento tecnico en incidentes de
            ingenieria clinica mediante simulaciones por pasos.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">
            Alcance actual
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>5 casos iniciales.</li>
            <li>Flujo estructurado en 7 etapas.</li>
            <li>Feedback por opcion seleccionada.</li>
            <li>Puntaje y reporte final.</li>
            <li>Guardado local del ultimo resultado.</li>
          </ul>

          <div className="mt-8">
            <Link
              href="/cases"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Explorar casos
            </Link>
          </div>

          <section className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Referencias de interfaz
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <a
                  href="https://www.nngroup.com/articles/progress-indicators/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-slate-800 underline"
                >
                  Patron de progreso por etapas (Nielsen Norman Group)
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://linear.app/docs/search"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-slate-800 underline"
                >
                  Densidad visual de herramientas educativas (Linear)
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </section>
        </section>
      </main>
    </div>
  );
}
