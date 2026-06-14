import { NextResponse } from "next/server";
import { addTransaction, getAllTransactions } from "@/lib/db";
import { filterTransactions } from "@/lib/insights";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const all = getAllTransactions();
  const filtered = filterTransactions(all, { category, from, to }).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return NextResponse.json({ transactions: filtered, all });
}

export async function POST(request) {
  const body = await request.json();

  const { amount, category, type, date, note } = body;

  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });
  }
  if (!category || typeof category !== "string") {
    return NextResponse.json({ error: "Category is required." }, { status: 400 });
  }
  if (type !== "income" && type !== "expense") {
    return NextResponse.json({ error: "Type must be 'income' or 'expense'." }, { status: 400 });
  }
  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }

  const transaction = addTransaction({
    amount: Math.abs(Number(amount)),
    category: category.trim(),
    type,
    date,
    note: typeof note === "string" ? note.trim() : "",
  });

  return NextResponse.json({ transaction }, { status: 201 });
}
