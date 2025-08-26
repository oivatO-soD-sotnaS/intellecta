import { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy";

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
 * POST /api/institutions -> proxy POST /institutions
 */
export async function POST(req: NextRequest) {
  return proxyPost(req, `/institutions`);
}
