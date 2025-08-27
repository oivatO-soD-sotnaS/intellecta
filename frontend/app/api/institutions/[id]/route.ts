// app/api/institutions/[id]/route.ts
import { NextRequest } from "next/server";
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyGet(req, `/institutions/${id}`);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // Envio de multipart/json é tratado no proxy (detecta content-type automaticamente)
  return proxyPut(req, `/institutions/${id}`);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyDelete(req, `/institutions/${id}`);
}
