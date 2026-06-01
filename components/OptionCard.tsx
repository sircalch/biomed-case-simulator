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
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            isSelected
              ? "bg-white/20 text-white"
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
