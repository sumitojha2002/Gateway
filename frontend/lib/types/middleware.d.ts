import { NextRequest } from "next/server";
import { JWT } from "next-auth/jwt";

declare module "next/server" {
  // Extend the NextRequest interface
  interface NextRequest {
    // Add the nextauth property which is injected by withAuth
    nextauth: {
      // The token property will contain the data from your JWT callback
      token: JWT | null;
      // You can add the session property here too, though token is usually used in middleware
      session: Session | null;
    } | null;
  }
}
