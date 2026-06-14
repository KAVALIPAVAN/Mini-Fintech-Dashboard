"use client";

import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/insights";

const today = () => new Date().toISOString().slice(0, 10);

export default function AddTransactionForm({ onAdd }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!category.trim()) {
      setError("Choose or enter a category.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, category: category.trim(), type, date, note }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't save that entry.");
      }

      setAmount("");
      setNote("");
      setCategory("");
      await onAdd();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <span className="block text-xs uppercase tracking-[0.18em] text-ink-soft mb-2">
          Entry type
        </span>
        <div className="grid grid-cols-2 gap-2">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setCategory("");
              }}
              className={`rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                type === t
                  ? t === "income"
                    ? "border-income bg-income-soft text-income"
                    : "border-expense bg-expense-soft text-expense"
                  : "border-rule text-ink-soft hover:border-rule-strong"
              }`}
              aria-pressed={type === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="block text-xs uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          Amount (₹)
        </span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-md border border-rule bg-white/60 px-3 py-2 font-mono text-base focus:bg-white"
        />
      </label>

      <label className="block">
        <span className="block text-xs uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          Category
        </span>
        <input
          type="text"
          list="category-options"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Choose or type a category"
          className="w-full rounded-md border border-rule bg-white/60 px-3 py-2 text-sm focus:bg-white"
        />
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label className="block">
        <span className="block text-xs uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          Date
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-rule bg-white/60 px-3 py-2 font-mono text-sm focus:bg-white"
        />
      </label>

      <label className="block">
        <span className="block text-xs uppercase tracking-[0.18em] text-ink-soft mb-1.5">
          Note <span className="text-ink-soft/70">(optional)</span>
        </span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Dinner with friends"
          maxLength={120}
          className="w-full rounded-md border border-rule bg-white/60 px-3 py-2 text-sm focus:bg-white"
        />
      </label>

      {error && (
        <p className="text-sm text-expense" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Add entry"}
      </button>
    </form>
  );
}
