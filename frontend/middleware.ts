// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeJwtExp } from "./lib/jwt";

const TOKEN_COOKIE = "token";            
const SESSION_EXPIRED_COOKIE = "session_expired";

const PUBLIC_PATHS = [
  "/", "/auth/login", "/auth/register", "/auth/forgot-password",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;        
  if (/\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff2?)$/i.test(pathname)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const now = Math.floor(Date.now() / 1000);

  const goLogin = () => {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("expired", "1");
    url.searchParams.set("next", pathname + search);

    const res = NextResponse.redirect(url);
    res.cookies.set(SESSION_EXPIRED_COOKIE, "1", {
      path: "/",
      maxAge: 120, // 2 min
      sameSite: "lax",
      secure: true,
    });
    res.cookies.set(TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  };

  if (!token) return goLogin();

  const exp = decodeJwtExp(token);
  if (!exp || exp < now) return goLogin();

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
