import { SIMULATION_STEPS } from "@/lib/case-engine";
import { SimulationStepId } from "@/types/case";

type StepProgressProps = {
  currentStep: SimulationStepId;
};

export function StepProgress({ currentStep }: StepProgressProps) {
  const activeIndex = SIMULATION_STEPS.findIndex((step) => step.id === currentStep);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Progreso del caso
      </h2>
      <ol className="mt-4 flex gap-2 overflow-auto pb-1">
        {SIMULATION_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = index < activeIndex;

          return (
            <li
              key={step.id}
              className={`flex min-w-48 items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : isDone
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-white text-slate-900"
                    : isDone
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-medium">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
