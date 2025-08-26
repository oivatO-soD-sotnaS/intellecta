import { NextRequest } from "next/server";
import { proxyGet } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search || "";
  return proxyGet(req, `/institutions/owned${search}`, {
    map404ToJSON: [], 
  });
}
