// lib/urls.ts
export function normalizeFileUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_FILES_BASE_URL || "";
  if (!base) return url.startsWith("/") ? url : `/${url}`;
  return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}
