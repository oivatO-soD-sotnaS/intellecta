import { NextRequest } from "next/server";
import { proxyPost } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return proxyPost(req, "/auth/sign-out", {
    clearCookies: ["token", "auth_token", "Authorization"],
  });
}