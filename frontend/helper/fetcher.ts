import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

interface FetchError extends Error {
  status?: number;
  data?: any;
}

const fetcher = async <T>(
  url: string,
  options: RequestInit = {},
  timeout = 10000,
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // ✅ Guard: if no session, don't attempt the fetch
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      clearTimeout(timeoutId);
      throw new Error("No active session");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${session.user.accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) notFound();

      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        redirect("/api/auth/signout");
      }

      const error: FetchError = new Error(
        `API Error: ${response.status} - ${errorData.message ?? "Unknown error"}`,
      );
      error.data = errorData;
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      // ✅ Don't crash — return empty data instead of throwing
      console.warn(`Request timed out: ${url}`);
      return { data: [], results: [], count: 0 } as T;
    }

    if (error.message === "No active session") {
      // ✅ Don't crash — just return empty
      return { data: [], results: [], count: 0 } as T;
    }

    throw error;
  }
};

export default fetcher;
