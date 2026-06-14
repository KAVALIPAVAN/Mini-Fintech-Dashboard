import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "transactions.json");

const SEED = [
  { id: "1", amount: 4200, category: "Salary", type: "income", date: "2026-05-01", note: "May paycheck" },
  { id: "2", amount: 1350, category: "Housing", type: "expense", date: "2026-05-02", note: "Rent" },
  { id: "3", amount: 86.4, category: "Groceries", type: "expense", date: "2026-05-03", note: "Weekly shop" },
  { id: "4", amount: 42.0, category: "Transport", type: "expense", date: "2026-05-04", note: "Metro pass" },
  { id: "5", amount: 19.99, category: "Subscriptions", type: "expense", date: "2026-05-05", note: "Streaming" },
  { id: "6", amount: 64.5, category: "Dining Out", type: "expense", date: "2026-05-06", note: "Dinner with friends" },
  { id: "7", amount: 250, category: "Freelance", type: "income", date: "2026-05-08", note: "Logo design" },
  { id: "8", amount: 120.75, category: "Groceries", type: "expense", date: "2026-05-10", note: "Restock" },
  { id: "9", amount: 35.0, category: "Entertainment", type: "expense", date: "2026-05-12", note: "Movies" },
  { id: "10", amount: 78.2, category: "Transport", type: "expense", date: "2026-05-14", note: "Fuel" },
  { id: "11", amount: 200, category: "Shopping", type: "expense", date: "2026-05-15", note: "New shoes" },
  { id: "12", amount: 54.3, category: "Dining Out", type: "expense", date: "2026-05-18", note: "Lunch out" },
  { id: "13", amount: 90.0, category: "Utilities", type: "expense", date: "2026-05-20", note: "Electricity" },
  { id: "14", amount: 45.0, category: "Health", type: "expense", date: "2026-05-22", note: "Pharmacy" },
  { id: "15", amount: 130.0, category: "Groceries", type: "expense", date: "2026-05-25", note: "Restock" },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2));
  }
}

export function getAllTransactions() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllTransactions(transactions) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
}

export function addTransaction(transaction) {
  const transactions = getAllTransactions();
  const newTransaction = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    ...transaction,
  };
  transactions.push(newTransaction);
  saveAllTransactions(transactions);
  return newTransaction;
}

export function deleteTransaction(id) {
  const transactions = getAllTransactions();
  const next = transactions.filter((t) => t.id !== id);
  saveAllTransactions(next);
  return next.length !== transactions.length;
}
