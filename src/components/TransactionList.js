"use client";

function formatDate(d) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-md border border-rule bg-white/40 px-4 py-10 text-center text-sm text-ink-soft">
        Nothing logged for this view. Add an entry or adjust your filters.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-rule bg-white/40">
      {/* Header row */}
      <div className="ledger-row grid grid-cols-[88px_1fr_auto_28px] gap-3 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ink-soft sm:grid-cols-[100px_140px_1fr_auto_28px]">
        <span>Date</span>
        <span className="hidden sm:block">Category</span>
        <span>Note</span>
        <span className="text-right">Amount</span>
        <span aria-hidden="true" />
      </div>

      {transactions.map((t) => (
        <div
          key={t.id}
          className="ledger-row grid grid-cols-[88px_1fr_auto_28px] items-center gap-3 px-4 py-2.5 text-sm sm:grid-cols-[100px_140px_1fr_auto_28px]"
        >
          <span className="font-mono text-xs text-ink-soft">{formatDate(t.date)}</span>
          <span className="hidden sm:block">
            <span className="inline-block rounded-full border border-rule bg-paper px-2 py-0.5 text-[11px] text-ink-soft">
              {t.category}
            </span>
          </span>
          <span className="truncate text-ink-soft sm:hidden">
            <span className="mr-1.5 inline-block rounded-full border border-rule bg-paper px-1.5 py-0.5 text-[10px] text-ink-soft">
              {t.category}
            </span>
            {t.note}
          </span>
          <span className="hidden truncate text-ink-soft sm:block">{t.note}</span>
          <span
            className={`text-right font-mono tabular-nums ${
              t.type === "income" ? "text-income" : "text-expense"
            }`}
          >
            {t.type === "income" ? "+" : "−"}
            {Number(t.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <button
            type="button"
            onClick={() => onDelete(t.id)}
            aria-label={`Delete entry: ${t.category} on ${formatDate(t.date)}`}
            className="justify-self-end text-ink-soft/60 transition-colors hover:text-expense"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
