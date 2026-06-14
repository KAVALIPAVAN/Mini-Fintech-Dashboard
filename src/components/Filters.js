"use client";

export default function Filters({ filters, onChange, categories }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          Category
        </span>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="rounded-md border border-rule bg-white/60 px-3 py-2 text-sm focus:bg-white"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          From
        </span>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
          className="rounded-md border border-rule bg-white/60 px-3 py-2 font-mono text-sm focus:bg-white"
        />
      </label>

      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          To
        </span>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
          className="rounded-md border border-rule bg-white/60 px-3 py-2 font-mono text-sm focus:bg-white"
        />
      </label>

      {(filters.category !== "All" || filters.from || filters.to) && (
        <button
          type="button"
          onClick={() => onChange({ category: "All", from: "", to: "" })}
          className="rounded-md border border-rule px-3 py-2 text-sm text-ink-soft hover:border-rule-strong hover:text-ink"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
