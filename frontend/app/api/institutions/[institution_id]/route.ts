// app/api/institutions/[institution_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy"

export async function GET(
  req: NextRequest,
  { params }: { params: { institution_id: string } }
) {
  const { institution_id } = params
  return proxyGet(req, `/institutions/${institution_id}`)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ institution_id: string }> },
) {
  const { institution_id } = await context.params;
  
  return proxyPut(req, `/institutions/${institution_id}`);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ institution_id: string }> },
) {
  const { institution_id } = await context.params;

  return proxyDelete(req, `/institutions/${institution_id}`);
}
