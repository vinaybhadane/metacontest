import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard — redirect if no Firebase session cookie
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("mc_session");
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/register";
      return NextResponse.redirect(url);
    }
  }

  // Protect admin — redirect non-admins to home
  // Full authorization is enforced server-side in the API route + client-side email check
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("mc_session");
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/admin"],
};
