import { NextRequest } from "next/server";
import { proxyGet } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await context.params;
  const search = req.nextUrl.search || "";
  return proxyGet(req, `/institutions/summaries/${institution_id}${search}`);
}
