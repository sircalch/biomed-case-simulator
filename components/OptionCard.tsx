import { QuestionOption } from "@/types/case";

type OptionCardProps = {
  option: QuestionOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
};

export function OptionCard({ option, isSelected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`w-full rounded-md border p-4 text-left transition ${
        isSelected
          ? "border-cyan-600 bg-cyan-50 text-cyan-950 ring-1 ring-cyan-600"
          : "border-slate-200 bg-white text-slate-800 hover:border-cyan-200 hover:bg-cyan-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            isSelected
              ? "bg-cyan-700 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {option.id.split("-").pop()?.toUpperCase() ?? "?"}
        </span>
        <p className="text-sm font-medium">{option.label}</p>
      </div>
    </button>
  );
}
