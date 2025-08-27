// app/api/files/upload-file/route.ts
import { NextRequest } from "next/server";
import { proxyPost } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return proxyPost(req, "/files/upload-file");
}
