import { NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email: email.toLowerCase().trim(), passwordHash });

  if (!user) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  return NextResponse.json({ user }, { status: 201 });
}
