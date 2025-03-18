import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isUserRoute = req.nextUrl.pathname.startsWith("/user");

  // ✅ Redirect unauthenticated users to /user (instead of login)
  if (!token) {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  // ✅ Admins can access /admin, users cannot
  if (isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ Users can access /user pages (including admins)
  if (isUserRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
