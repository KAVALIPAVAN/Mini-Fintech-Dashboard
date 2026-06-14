import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { findUserById } from "@/lib/db";

function getTokenFromReq(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(request) {
  const token = getTokenFromReq(request);
  const payload = verifyToken(token);
  if (!payload || !payload.sub) {
    return NextResponse.json({ user: null });
  }

  const user = await findUserById(payload.sub);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: { id: user._id.toString(), email: user.email } });
}
