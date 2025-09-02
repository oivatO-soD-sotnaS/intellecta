// lib/jwt.ts

export function decodeJwtExp(token: string): number | undefined {
  try {
    const part = token.split(".")[1];
    if (!part) return undefined;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json);
    return typeof payload?.exp === "number" ? payload.exp : undefined;
  } catch {
    return undefined;
  }
}
