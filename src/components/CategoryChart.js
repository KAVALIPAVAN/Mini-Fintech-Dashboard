"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const BAR_COLOR = "#b9573b"; // expense color

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { category, amount } = payload[0].payload;
  return (
    <div className="rounded-md border border-rule bg-paper px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-ink">{category}</p>
      <p className="font-mono text-expense">
        ₹{Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-md border border-rule bg-white/40 text-sm text-ink-soft">
        No expenses in this view yet.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-rule bg-white/40 p-3 sm:p-4">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#d8cfbb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#4d5762", fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "#d8cfbb" }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#4d5762", fontFamily: "var(--font-mono)" }}
            tickLine={false}
            axisLine={{ stroke: "#d8cfbb" }}
            tickFormatter={(v) => `₹${v}`}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(184,87,59,0.08)" }} />
          <Bar dataKey="amount" fill={BAR_COLOR} radius={[3, 3, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
