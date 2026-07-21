import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/mongodb";

const ADMIN_COLLECTION = "admins";
const SESSION_COOKIE = "quai_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const seededAdmin = {
  email: process.env.ADMIN_SEED_EMAIL || "admin@quai.network",
  password: process.env.ADMIN_SEED_PASSWORD || "QuaiAdmin@2026",
};

type AdminRecord = {
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function passwordHash(email: string, password: string) {
  return scryptSync(password, `quai-admin:${normalizeEmail(email)}`, 64).toString("hex");
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "quai-dashboard-session-change-this-secret";
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export async function ensureSeededAdmin() {
  const admins = (await getDatabase()).collection<AdminRecord>(ADMIN_COLLECTION);
  const email = normalizeEmail(seededAdmin.email);
  await admins.updateOne(
    { email },
    {
      $setOnInsert: {
        email,
        passwordHash: passwordHash(email, seededAdmin.password),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
  await admins.createIndex({ email: 1 }, { unique: true });
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureSeededAdmin();
  const normalizedEmail = normalizeEmail(email);
  const admin = await (await getDatabase()).collection<AdminRecord>(ADMIN_COLLECTION).findOne({ email: normalizedEmail });
  if (!admin) return null;
  const expected = Buffer.from(admin.passwordHash, "hex");
  const actual = Buffer.from(passwordHash(normalizedEmail, password), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual) ? admin : null;
}

function createSessionValue(email: string) {
  const payload = Buffer.from(JSON.stringify({ email: normalizeEmail(email), expiresAt: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readSessionValue(value?: string) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expiresAt?: number };
    if (!session.email || !session.expiresAt || session.expiresAt < Date.now()) return null;
    return { email: normalizeEmail(session.email) };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  return readSessionValue(store.get(SESSION_COOKIE)?.value);
}

export async function createAdminSession(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
