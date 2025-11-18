import { NextRequest } from "next/server";

import { proxyGet } from "@/app/api/_lib/proxy";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * GET /api/institutions -> proxy GET /institutions
 */
export async function GET(req: NextRequest) {
  const search = req.nextUrl.search || "";

  return proxyGet(req, `/institutions${search}`, {
    map404ToJSON: { items: [], total: 0 },
  });
}

/**
 * POST /api/institutions -> /institutions
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = (await cookies()).get("token")?.value

  const response = await fetch("http://api.intellecta/institutions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": req.headers.get("User-Agent") ?? "",
    },
    body: formData, // repassa arquivos intactos
  });

  return response;
}
