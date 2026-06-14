import { NextResponse } from "next/server";
import { deleteTransaction } from "@/lib/db";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const deleted = deleteTransaction(id);

  if (!deleted) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
