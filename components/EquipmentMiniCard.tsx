import { CaseScenario } from "@/types/case";

type EquipmentMiniCardProps = {
  scenario: CaseScenario;
};

export function EquipmentMiniCard({ scenario }: EquipmentMiniCardProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Equipo
      </p>
      <h2 className="mt-1 text-base font-semibold text-slate-900">
        {scenario.equipment}
      </h2>
      <p className="mt-2 text-sm text-slate-700">
        Dificultad: <span className="font-medium">{scenario.difficulty}</span>
      </p>
      <p className="text-sm text-slate-700">
        Duracion estimada:{" "}
        <span className="font-medium">{scenario.estimatedMinutes} min</span>
      </p>
    </aside>
  );
}
