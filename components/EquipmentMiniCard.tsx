import { CaseScenario } from "@/types/case";

type EquipmentMiniCardProps = {
  scenario: CaseScenario;
};

export function EquipmentMiniCard({ scenario }: EquipmentMiniCardProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Equipo
      </p>
      <h2 className="mt-1 text-base font-semibold text-slate-900">
        {scenario.equipment}
      </h2>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <dt className="text-xs font-semibold uppercase text-slate-500">
            Dificultad
          </dt>
          <dd className="mt-1 font-medium text-slate-900">{scenario.difficulty}</dd>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <dt className="text-xs font-semibold uppercase text-slate-500">
            Duracion estimada
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {scenario.estimatedMinutes} min
          </dd>
        </div>
      </dl>
    </aside>
  );
}
