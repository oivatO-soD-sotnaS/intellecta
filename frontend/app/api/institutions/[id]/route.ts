import { NextRequest } from "next/server";
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

/** GET /api/institutions/:institution_id -> /institutions/:institution_id  */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await context.params;
  const search = req.nextUrl.search || "";
  return proxyGet(req, `/institutions/${institution_id}${search}`);
}

/** PUT /api/institutions/:institution_id -> /institutions/:institution_id  */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await context.params;
  return proxyPut(req, `/institutions/${institution_id}`);
}

/** DELETE /api/institutions/:institution_id -> /institutions/:institution_id  */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await context.params;
  return proxyDelete(req, `/institutions/${institution_id}`);
}
