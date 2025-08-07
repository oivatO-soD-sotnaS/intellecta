// app/api/_lib/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_BASE_URL!;
if (!API) throw new Error("API_BASE_URL não definida");

export async function proxyGet(
  req: NextRequest,
  upstreamPath: string
): Promise<NextResponse> {
  const token = req.cookies.get("token")?.value;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const upstream = await fetch(`${API}${upstreamPath}`, { method: "GET", headers });
  const contentType = upstream.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "text/plain" },
  });
}
