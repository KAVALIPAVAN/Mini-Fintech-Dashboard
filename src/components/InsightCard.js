export default function InsightCard({ insight }) {
  return (
    <div className="relative rounded-md border border-dashed border-accent bg-accent-soft px-4 py-3.5 sm:px-5">
      <div className="flex items-start gap-3">
        <span className="font-display text-lg leading-none text-accent mt-0.5" aria-hidden="true">
          ✦
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft mb-1">
            Insight
          </p>
          <p className="text-sm leading-relaxed text-ink">{insight.message}</p>
        </div>
      </div>
    </div>
  );
}
