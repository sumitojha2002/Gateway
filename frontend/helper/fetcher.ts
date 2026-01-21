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
  timeout = 10000
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const session = await getServerSession(authOptions);
    // const lang = cookies().get("lang")?.value || "en";

    const headers = {
      ...options.headers,
      ...(session?.user?.accessToken && {
        Authorization: `Bearer ${session.user.accessToken}`,
      }),
      "Content-Type": "application/json",
      //   "X-Language": lang,
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
        `API Error: ${response.status} - ${
          errorData.message ?? "Unknown error"
        }`
      );

      error.data = errorData;
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }

    throw error;
  }
};

export default fetcher;
