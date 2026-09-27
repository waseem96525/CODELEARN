/**
 * Typed helpers for the JSON-in-String columns.
 *
 * SQLite has no JSON column type, so structured fields (lesson content, starter
 * code, checklists, ...) are persisted as strings. Every read/write goes through
 * these helpers so malformed data degrades to a default instead of throwing and
 * taking down a whole page render.
 */

export function toJson(value: unknown): string {
  return JSON.stringify(value);
}

export function fromJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function parseStringArray(raw: string | null | undefined): string[] {
  return fromJson<string[]>(raw, []);
}
