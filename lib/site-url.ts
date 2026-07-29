/**
 * Canonical origin for metadata, sitemap, and robots.
 * Prefer NEXT_PUBLIC_SITE_URL (custom domain). On Vercel, URLs are inferred when unset.
 *
 * Note: `http://` is upgraded to `https://` for non-local hosts so metadata never points at
 * wrong origins. That does not change how browsers load `/_next/*` (those stay same-origin).
 */

function stripTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

function isLocalHttpHost(url: URL): boolean {
  const h = url.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h.endsWith(".localhost");
}

function normalizeExplicit(urlRaw: string): string {
  const raw = stripTrailingSlashes(urlRaw.trim());
  let u: URL;
  try {
    u = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return raw;
  }
  if (u.protocol === "http:" && !isLocalHttpHost(u)) {
    u.protocol = "https:";
  }
  return u.origin;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return normalizeExplicit(explicit);
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    const host = production.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}
