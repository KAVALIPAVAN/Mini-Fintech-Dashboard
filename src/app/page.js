"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import AddTransactionForm from "@/components/AddTransactionForm";
import SummaryCards from "@/components/SummaryCards";
import InsightCard from "@/components/InsightCard";
import CategoryChart from "@/components/CategoryChart";
import Filters from "@/components/Filters";
import TransactionList from "@/components/TransactionList";
import { getSummary, getInsight, filterTransactions } from "@/lib/insights";

export default function Home() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filters, setFilters] = useState({ category: "All", from: "", to: "" });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setAllTransactions(data.all || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => filterTransactions(allTransactions, filters).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [allTransactions, filters]
  );

  const summary = useMemo(() => getSummary(filtered), [filtered]);
  const insight = useMemo(
    () => getInsight(allTransactions, filtered),
    [allTransactions, filtered]
  );

  const categories = useMemo(() => {
    const set = new Set(allTransactions.map((t) => t.category));
    return Array.from(set).sort();
  }, [allTransactions]);

  async function handleDelete(id) {
    setAllTransactions((prev) => prev.filter((t) => t.id !== id));
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // revert on failure
      await load();
    }
  }

  return (
    <div className="min-h-screen paper-texture">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-baseline justify-between border-b border-rule pb-5">
          <div>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">Ledger</h1>
            <p className="mt-1 text-sm text-ink-soft">
              A running record of what comes in and what goes out.
            </p>
          </div>
          <span className="font-mono text-xs text-ink-soft hidden sm:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
          {/* Sidebar: add entry */}
          <aside className="lg:order-1">
            <div className="rounded-lg border border-rule bg-white/50 p-5">
              <h2 className="font-display text-lg text-ink mb-4">New entry</h2>
              <AddTransactionForm onAdd={load} />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex flex-col gap-6 lg:order-2">
            {loading ? (
              <p className="text-sm text-ink-soft">Loading your ledger…</p>
            ) : (
              <>
                <SummaryCards summary={summary} />
                <InsightCard insight={insight} />

                <section>
                  <h2 className="font-display text-lg text-ink mb-3">Spending by category</h2>
                  <CategoryChart data={summary.categoryBreakdown} />
                </section>

                <section>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-lg text-ink">Transactions</h2>
                    <Filters filters={filters} onChange={setFilters} categories={categories} />
                  </div>
                  <TransactionList transactions={filtered} onDelete={handleDelete} />
                </section>
              </>
            )}
          </main>
        </div>

        <footer className="mt-12 border-t border-rule pt-5 text-xs text-ink-soft">
          Ledger — a simple personal finance tracker.
        </footer>
      </div>
    </div>
  );
}
