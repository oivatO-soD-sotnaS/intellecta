// app/api/me/route.ts
import { NextRequest } from "next/server"

import { proxyGet } from "../../../_lib/proxy"

export async function GET(req: NextRequest) {
  return proxyGet(req, "/users/me/events/upcoming");
}