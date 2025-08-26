// app/api/users/[id]/route.ts
import { NextRequest } from "next/server";
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyGet(req, `/users/${id}`);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyPut(req, `/users/${id}`);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyDelete(req, `/users/${id}`);
}
