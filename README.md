# Ledger — Mini Fintech Dashboard

A personal finance tracker built with **Next.js App Router**. Log income and expenses, filter by category or date range, and get spending insights with MongoDB persistence and user authentication.

## Features

- **User authentication** — register, login, logout with JWT cookies
- **Add transactions** — amount, type (income / expense), category, date, optional note
- **Delete transactions** — remove entries for the signed-in user only
- **Filter** by category and date range
- **Summary cards** — total income, total expenses, net balance, category breakdown
- **Spending by category chart** — bar chart via Recharts
- **Insights** — spending trends and category concentration alerts

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS v4 |
| Database | MongoDB Atlas / MongoDB |
| Charts | Recharts |
| Auth | JWT cookies, bcrypt password hashing |

## Environment variables

Create a `.env` file in the project root with:

```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=your-database-name
JWT_SECRET=your-jwt-secret
```

Optional for debugging TLS issues in Atlas:

```env
MONGODB_TLS_INSECURE=true
```

## Getting started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Local development

```bash
git clone https://github.com/<your-username>/Mini-Fintech-Dashboard.git
cd fintech-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## Auth flow

- Register a new user via the header widget.
- Login uses `/api/auth/login` and stores a JWT in an HttpOnly `token` cookie.
- `/api/me` returns the current user profile.
- Logout clears the cookie via `/api/auth/logout`.

## API routes

- `POST /api/auth/register` — create a new user
- `POST /api/auth/login` — log in and set auth cookie
- `POST /api/auth/logout` — clear auth cookie
- `GET /api/me` — get the current signed-in user
- `GET /api/transactions` — fetch transactions for the signed-in user
- `POST /api/transactions` — add a new transaction
- `DELETE /api/transactions/[id]` — delete a transaction by id

## Project structure

```
src/
  app/
    api/
      auth/
        login/route.js
        logout/route.js
        register/route.js
      me/route.js
      transactions/
        route.js
        [id]/route.js
    globals.css
    layout.js
    page.js
  components/
    AddTransactionForm.js
    AuthWidget.js
    CategoryChart.js
    Filters.js
    InsightCard.js
    LoginForm.js
    RegisterForm.js
    SummaryCards.js
    TransactionList.js
  lib/
    auth.js
    db.js
    insights.js
```

## Notes

- The app now uses MongoDB instead of the old flat-file store.
- Make sure Vercel env vars are correctly configured for Atlas.
- Use a strong `JWT_SECRET` in production and enable HTTPS.


