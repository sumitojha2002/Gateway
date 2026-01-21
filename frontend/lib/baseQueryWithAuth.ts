"use client"; // ensures client-side execution

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "@/constants";

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();

    if (!session) {
      console.warn("No session found; request will be unauthenticated");
      return headers;
    }

    // Add JWT from NextAuth session
    if (session?.user?.accessToken) {
      headers.set("Authorization", `Bearer ${session.user.accessToken}`);
    }

    return headers;
  },
});
