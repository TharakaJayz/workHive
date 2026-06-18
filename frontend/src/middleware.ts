// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserRole } from "./shared/enum";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; 
    const path = req.nextUrl.pathname;

    // 1. Protect employer routes
    if (path.startsWith("/employer") && token?.role === UserRole.JOB_SEEKER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 2. Protect admin routes
    if (path.startsWith("/admin") && token?.role !== UserRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/employer/:path*", "/admin/:path*"],
};