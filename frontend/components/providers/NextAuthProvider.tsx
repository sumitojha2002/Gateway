// src/components/providers/NextAuthProvider.tsx
"use client"; // <-- CRITICAL: Tells Next.js this uses browser-only features

import { SessionProvider } from "next-auth/react";
import React from "react";

// We can optionally fetch the session here if needed
// This component acts as a wrapper to provide the session context to the entire app.
export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // SessionProvider automatically handles fetching session data from /api/auth/session
  return <SessionProvider>{children}</SessionProvider>;
}
