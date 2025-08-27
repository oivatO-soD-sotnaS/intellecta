// lib/format.ts
export function formatNumber(n?: number | null) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function formatDatePtBR(d?: string | Date | null, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    ...(opts || {}),
  });
  return fmt.format(date);
}

export function timeAgo(d?: string | Date | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const sec = Math.round(diff / 1000);
  const map: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  for (const [unit, s] of map) {
    if (Math.abs(sec) >= s || unit === "second") {
      const value = Math.round(sec / s) * -1; 
      return rtf.format(value, unit);
    }
  }
  return "—";
}
