# Ledger — Mini Fintech Dashboard

A personal finance tracker built with **Next.js 15 App Router**. Log income and expenses, filter by category or date range, and get rule-based spending insights.

## Features

- **Add transactions** — amount, type (income / expense), category, date, optional note
- **Filter** by category and/or date range
- **Summary cards** — total income, total expenses, net balance, top spending category
- **Spending by category chart** — bar chart via Recharts
- **Rule-based insight** — month-over-month comparison, concentration alert, savings rate, and more
- **Delete entries** in one click

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Storage | JSON flat-file (`data/transactions.json`) via Node `fs` |

> **Note:** The flat-file store is designed for local use and a single user. For production or multi-user use, swap `src/lib/db.js` for a Postgres / SQLite adapter.

## Getting started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Local development

```bash
git clone https://github.com/<your-username>/ledger-fintech-dashboard
cd ledger-fintech-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app seeds 15 example transactions on first run (stored in `data/transactions.json`). Delete the file to start fresh.

### Production build

```bash
npm run build
npm start
``````


## Project structure

```
src/
  app/
    api/
      transactions/
        route.js          # GET (with filters) + POST
        [id]/route.js     # DELETE
    globals.css           # Design tokens + base styles
    layout.js
    page.js               # Main dashboard page
  components/
    AddTransactionForm.js
    CategoryChart.js
    Filters.js
    InsightCard.js
    SummaryCards.js
    TransactionList.js
  lib/
    db.js                 # JSON flat-file read/write helpers
    insights.js           # Summary, filtering, rule-based insights
data/
  transactions.json       # Auto-created on first run
```

## Insight logic

The rule engine in `src/lib/insights.js` checks (in priority order):

1. **Overspend** — expenses exceed income in the current view
2. **Concentration** — one category is ≥ 35% of total expenses
3. **Month-over-month trend** — spending changed ≥ 10% vs the previous calendar month
4. **Savings rate** — fallback: shows the % of income saved


