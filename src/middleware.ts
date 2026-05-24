import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard — redirect if no Firebase session cookie
  // We check for a session marker cookie set after successful login
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("mc_session");
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/register";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
