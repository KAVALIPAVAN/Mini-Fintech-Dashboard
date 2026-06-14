function formatCurrency(n) {
  return `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SummaryCards({ summary }) {
  const { totalIncome, totalExpense, netBalance, topCategory } = summary;

  const cards = [
    {
      label: "Total income",
      value: formatCurrency(totalIncome),
      accent: "text-income",
      eyebrow: "In",
    },
    {
      label: "Total expenses",
      value: formatCurrency(totalExpense),
      accent: "text-expense",
      eyebrow: "Out",
    },
    {
      label: "Net balance",
      value: formatCurrency(netBalance),
      accent: netBalance >= 0 ? "text-income" : "text-expense",
      eyebrow: "Net",
    },
    {
      label: "Top category",
      value: topCategory ? topCategory.category : "—",
      sub: topCategory ? formatCurrency(topCategory.amount) : "No expenses yet",
      accent: "text-ink",
      eyebrow: "Most",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-rule bg-white/50 px-4 py-3.5"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              {card.label}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/60">
              {card.eyebrow}
            </span>
          </div>
          <p className={`font-display text-2xl mt-1.5 leading-tight ${card.accent}`}>
            {card.value}
          </p>
          {card.sub && <p className="font-mono text-xs text-ink-soft mt-0.5">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
}
