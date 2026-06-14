import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ sub: user._id.toString(), email: user.email });
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, path: "/", sameSite: "lax" });
  return res;
}
