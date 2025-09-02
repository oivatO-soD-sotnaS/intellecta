// app/api/v1/users/upload-profile-picture/route.ts
import { NextRequest } from "next/server";
import { proxyPost } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // reusa seu proxy já existente
  return proxyPost(req, "/files/upload-profile-assets");
}
