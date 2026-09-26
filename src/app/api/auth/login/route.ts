import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";
import { badRequest, readJson } from "@/lib/api";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest("Enter your email and password");
  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  // constant-ish time: always run a compare
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
  if (!user || !ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  const token = await signSession({ sub: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
