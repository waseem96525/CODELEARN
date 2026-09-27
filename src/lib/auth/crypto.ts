import {
  randomBytes,
  scrypt as _scrypt,
  timingSafeEqual,
  createHmac,
} from "node:crypto";
import { promisify } from "node:util";

// No `server-only` marker here on purpose: these are pure Node built-ins, so
// they can never be pulled into a client bundle, and the seed script needs to
// hash passwords outside of Next's module resolution.

const scrypt = promisify(_scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/**
 * Password hashing with scrypt from the Node standard library.
 * Deliberately dependency-free: no native modules to rebuild per platform.
 * Format: scrypt$N$r$p$saltHex$hashHex
 */
const KEYLEN = 64;
const SALT_BYTES = 16;
const PARAMS = { N: 16384, r: 8, p: 1 } as const;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = (await scrypt(password, salt, KEYLEN)) as Buffer;
  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("hex"),
    derived.toString("hex"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  try {
    const [scheme, n, r, p, saltHex, hashHex] = stored.split("$");
    if (scheme !== "scrypt") return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = (await scrypt(password, salt, expected.length)) as Buffer;

    // Constant-time compare to avoid leaking match position via timing.
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Unguessable, URL-safe token for session ids, reset links, certificate serials. */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Copy .env.example to .env and set a random value.",
    );
  }
  return secret;
}

/** Signs a session token so a stolen database row cannot be replayed as a cookie. */
export function signToken(token: string): string {
  const mac = createHmac("sha256", getSecret()).update(token).digest("base64url");
  return `${token}.${mac}`;
}

export function unsignToken(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx <= 0) return null;
  const token = signed.slice(0, idx);
  const mac = signed.slice(idx + 1);
  const expected = createHmac("sha256", getSecret()).update(token).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? token : null;
}

export const SESSION_COOKIE = "codelearn_session";
export const SESSION_TTL_DAYS = 30;
