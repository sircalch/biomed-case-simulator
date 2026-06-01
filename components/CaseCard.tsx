import Link from "next/link";

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
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{scenario.title}</h3>
        <span
          className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${difficultyClass}`}
        >
          {scenario.difficulty}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{scenario.equipment}</p>
      <p className="mt-3 text-sm text-slate-700">{scenario.initialReport}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {scenario.estimatedMinutes} min
        </p>
        <Link
          href={`/cases/${scenario.id}`}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Iniciar caso
        </Link>
      </div>
    </article>
  );
}
