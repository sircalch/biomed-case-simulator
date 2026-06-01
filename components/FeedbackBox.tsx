type FeedbackBoxTone = "info" | "success" | "warning";

type FeedbackBoxProps = {
  title: string;
  message: string;
  tone?: FeedbackBoxTone;
};

const TONE_STYLES: Record<FeedbackBoxTone, string> = {
  info: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

export function FeedbackBox({
  title,
  message,
  tone = "info",
}: FeedbackBoxProps) {
  return (
    <section className={`rounded-md border px-4 py-3 ${TONE_STYLES[tone]}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm">{message}</p>
    </section>
  );
}
