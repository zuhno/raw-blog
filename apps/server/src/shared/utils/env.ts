export function parseAllowedOriginsFromEnv(raw?: string): string[] {
  if (!raw) return [];

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // passing if already decoded
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(decoded);
  } catch {
    // fail parsing to 'json' -> parse 'csv'
    return normalizeOrigins(decoded.split(","));
  }

  if (Array.isArray(parsed)) {
    return normalizeOrigins(parsed);
  }

  throw new Error("ALLOW_ACCESS_ORIGIN must be JSON array or CSV string");
}

function normalizeOrigins(arr: unknown[]): string[] {
  const out = arr.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);

  const unique = Array.from(new Set(out)).filter((o) => {
    try {
      const u = new URL(o);
      return !!u.protocol && !!u.host;
    } catch {
      return false;
    }
  });

  if (unique.length === 0) {
    throw new Error("No valid origins found");
  }

  return unique;
}
