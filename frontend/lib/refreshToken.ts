import { jwtDecode } from "jwt-decode";

interface DjangoJWT {
  exp: number;
}

export async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) throw new Error("No refresh token available");

    const res = await fetch(
      process.env.NEXT_PUBLIC_DJANGO_BASE_URL + "/api/account/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh: token.refreshToken,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw data;

    const decoded = jwtDecode<DjangoJWT>(data.access);

    return {
      ...token,
      accessToken: data.access,
      refreshToken: data.refresh ?? token.refreshToken,
      accessTokenExpires: decoded.exp * 1000, // convert to ms
    };
  } catch (error) {
    console.error("Refresh token error", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
