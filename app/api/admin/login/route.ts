import { NextResponse } from "next/server";
import { authenticateAdmin, createAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email = "", password = "" } = await request.json();
    if (typeof email !== "string" || typeof password !== "string") return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    const admin = await authenticateAdmin(email, password);
    if (!admin) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    await createAdminSession(admin.email);
    return NextResponse.json({ ok: true, email: admin.email });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
