// middleware.ts

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// IMPORTANT: You can remove the unused line:
// import type { NextRequest } from "next/server";

// Define the roles allowed to access the entire application (except public routes)
const allowedRoles = ["jobseeker", "employer"];

export default withAuth(
  // 2. EXPLICITLY TYPE the request parameter here:
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const userRole = request.nextauth?.token?.role;

    // --- Role-Based Redirection Logic (No change needed here) ---
    // 1. Protection for /employer/* routes:
    if (pathname.startsWith("/employer") && userRole !== "employer") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 2. Protection for /jobseeker/* routes:
    if (pathname.startsWith("/jobseeker") && userRole !== "jobseeker") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 3. Prevent logged-in users from accessing the login/register page
    if (pathname === "/login-register" && request.nextauth?.token) {
      // NOTE: Redirecting to the user's dashboard (e.g., /employer) is often better
      // but redirecting to '/' is fine if '/' is now public.
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // You can make this simpler since you are doing the protection in the middleware function:
        // For the new matcher, this only needs to ensure a token exists.
        return !!token; // <-- Just check if a token exists for protected routes
      },
    },
    pages: {
      signIn: "/login-register",
    },
  }
);

// 🛑 THE CRITICAL FIX IS HERE: List ONLY the paths that MUST be protected
export const config = {
  matcher: [
    // PROTECT: All paths starting with /employer/
    "/employer/:path*",
    // PROTECT: All paths starting with /jobseeker/
    "/jobseeker/:path*",
    // You do NOT need to include "/" or "/login-register" here.
  ],
};
