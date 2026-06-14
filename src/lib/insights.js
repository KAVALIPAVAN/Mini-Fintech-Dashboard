// Categories suggested in the add-transaction form
export const EXPENSE_CATEGORIES = [
  "Housing",
  "Groceries",
  "Transport",
  "Utilities",
  "Dining Out",
  "Entertainment",
  "Subscriptions",
  "Shopping",
  "Health",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];

export function filterTransactions(transactions, { category, from, to } = {}) {
  return transactions.filter((t) => {
    if (category && category !== "All" && t.category !== category) return false;
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    return true;
  });
}

export function getSummary(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const expenseByCategory = {};

  for (const t of transactions) {
    const amount = Number(t.amount) || 0;
    if (t.type === "income") {
      totalIncome += amount;
    } else {
      totalExpense += amount;
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + amount;
    }
  }

  const categoryBreakdown = Object.entries(expenseByCategory)
    .map(([category, amount]) => ({ category, amount: round2(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryBreakdown[0] || null;

  return {
    totalIncome: round2(totalIncome),
    totalExpense: round2(totalExpense),
    netBalance: round2(totalIncome - totalExpense),
    topCategory,
    categoryBreakdown,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Rule-based insight generation. Looks at the currently filtered set of
// transactions plus the full history to compare month-over-month spending.
export function getInsight(allTransactions, filteredTransactions) {
  const summary = getSummary(filteredTransactions);

  if (filteredTransactions.length === 0) {
    return {
      type: "empty",
      message: "No transactions yet for this view. Add a transaction or adjust your filters to see insights.",
    };
  }

  // Rule 1: spending exceeds income in the current view
  if (summary.totalExpense > summary.totalIncome && summary.totalIncome > 0) {
    const over = round2(summary.totalExpense - summary.totalIncome);
    return {
      type: "overspend",
      message: `You're spending more than you earn in this view — expenses exceed income by ₹${over.toLocaleString()}.`,
    };
  }

  // Rule 2: top category dominates spending (over 35% of total expenses)
  if (summary.topCategory && summary.totalExpense > 0) {
    const share = (summary.topCategory.amount / summary.totalExpense) * 100;
    if (share >= 35) {
      return {
        type: "concentration",
        message: `${summary.topCategory.category} makes up ${share.toFixed(0)}% of your spending — your largest single category in this view.`,
      };
    }
  }

  // Rule 3: month-over-month comparison using all transactions
  const monthlyTotals = getMonthlyExpenseTotals(allTransactions);
  const months = Object.keys(monthlyTotals).sort();
  if (months.length >= 2) {
    const latest = months[months.length - 1];
    const previous = months[months.length - 2];
    const latestTotal = monthlyTotals[latest];
    const previousTotal = monthlyTotals[previous];
    if (previousTotal > 0) {
      const change = ((latestTotal - previousTotal) / previousTotal) * 100;
      if (Math.abs(change) >= 10) {
        const direction = change > 0 ? "increased" : "decreased";
        return {
          type: "trend",
          message: `Your spending ${direction} by ${Math.abs(change).toFixed(0)}% compared to the previous month (${formatMonth(previous)} → ${formatMonth(latest)}).`,
        };
      }
    }
  }

  // Fallback: healthy savings rate
  if (summary.totalIncome > 0) {
    const savingsRate = (summary.netBalance / summary.totalIncome) * 100;
    return {
      type: "healthy",
      message: `You're saving ${savingsRate.toFixed(0)}% of your income in this view. Net balance: ₹${summary.netBalance.toLocaleString()}.`,
    };
  }

  return {
    type: "general",
    message: `Total spending in this view is ₹${summary.totalExpense.toLocaleString()}, with ${summary.topCategory ? summary.topCategory.category : "no"} as the top category.`,
  };
}

function getMonthlyExpenseTotals(transactions) {
  const totals = {};
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const month = (t.date || "").slice(0, 7); // YYYY-MM
    if (!month) continue;
    totals[month] = (totals[month] || 0) + (Number(t.amount) || 0);
  }
  return totals;
}

function formatMonth(ym) {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}
