import Link from "next/link";
import { ArrowRight, Clock3, FlaskConical } from "lucide-react";

import { CaseScenario } from "@/types/case";

type CaseCardProps = {
  scenario: CaseScenario;
};

export function CaseCard({ scenario }: CaseCardProps) {
  const difficultyClass =
    scenario.difficulty === "Basico"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-lg font-semibold leading-tight text-slate-950">
              {scenario.title}
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
              {scenario.equipment}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${difficultyClass}`}
        >
          {scenario.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-700">{scenario.initialReport}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          {scenario.estimatedMinutes} min
        </p>
        <Link
          href={`/cases/${scenario.id}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
        >
          Iniciar caso
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
