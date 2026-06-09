import { CaseEvaluation, CaseScenario } from "@/types/case";

type FinalCaseReportProps = {
  scenario: CaseScenario;
  evaluation: CaseEvaluation;
};

const REPORT_BUILDER_URL =
  process.env.NEXT_PUBLIC_REPORT_BUILDER_URL ||
  "https://clinical-report-builder.vercel.app";

function verdictClass(verdict: CaseEvaluation["verdict"]) {
  if (verdict === "Excelente") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (verdict === "Solido") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }
  return "border-rose-200 bg-rose-50 text-rose-800";
}

export function FinalCaseReport({ scenario, evaluation }: FinalCaseReportProps) {
  const reportUrl = new URL(REPORT_BUILDER_URL);
  reportUrl.searchParams.set("activity", "case");
  reportUrl.searchParams.set("caseId", scenario.id);
  reportUrl.searchParams.set("equipment", scenario.equipment);
  reportUrl.searchParams.set("score", String(evaluation.score));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Resultado final</h2>
        <span
          className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${verdictClass(evaluation.verdict)}`}
        >
          {evaluation.verdict}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Puntaje</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {evaluation.score}/{evaluation.maxScore}
          </p>
        </article>
        <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Respuestas correctas
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {evaluation.correctCount}/{evaluation.totalQuestions}
          </p>
        </article>
        <article className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Equipo</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {scenario.equipment}
          </p>
        </article>
      </div>

      <section className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Resolucion tecnica</h3>
        <p className="mt-2 text-sm text-slate-700">{scenario.finalResolution}</p>
      </section>

      <section className="mt-5 space-y-3">
        {evaluation.details.map((detail) => (
          <article
            key={detail.key}
            className="rounded-md border border-slate-200 bg-white p-4"
          >
            <p className="text-sm font-semibold text-slate-900">{detail.prompt}</p>
            <p className="mt-2 text-sm text-slate-700">
              Tu respuesta:{" "}
              <span className="font-medium text-slate-900">
                {detail.selectedLabel}
              </span>
            </p>
            {!detail.isCorrect ? (
              <p className="mt-1 text-sm text-slate-700">
                Respuesta correcta:{" "}
                <span className="font-medium text-slate-900">
                  {detail.correctLabel}
                </span>
              </p>
            ) : null}
            <p className="mt-2 text-sm text-slate-600">{detail.explanation}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Aprendizajes clave</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {scenario.learningPoints.map((point) => (
            <li key={point}>- {point}</li>
          ))}
        </ul>
      </section>

      <a
        href={reportUrl.toString()}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
      >
        Generar reporte tecnico
      </a>
    </section>
  );
}
