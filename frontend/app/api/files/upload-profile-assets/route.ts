// app/api/files/upload-profile-assets/route.ts
import { NextRequest } from "next/server";
import { proxyPost } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // o proxy já detecta multipart e NÃO seta content-type manualmente
  return proxyPost(req, "/files/upload-profile-assets");
}
