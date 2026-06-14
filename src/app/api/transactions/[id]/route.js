import { NextResponse } from "next/server";
import { deleteTransaction } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function getTokenFromReq(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const token = getTokenFromReq(request);
  const payload = verifyToken(token);
  if (!payload || !payload.sub) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const deleted = await deleteTransaction(id, payload.sub);

  if (!deleted) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
