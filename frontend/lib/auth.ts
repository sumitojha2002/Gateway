import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "./refreshToken";

// This is where you connect to your Django API for authentication
const DJANGO_LOGIN_URL =
  process.env.NEXT_PUBLIC_DJANGO_BASE_URL + "/api/account/login/";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(DJANGO_LOGIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          console.error("Login failed:", result);
          return null;
        }

        const { user, tokens } = result.data;

        // ✅ THIS is what NextAuth expects
        return {
          id: user.email, // or user_id if you later add it
          email: user.email,
          name: user.full_name,
          role: user.role, // "job_seeker"
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 🔐 Initial login
      if (user) {
        return {
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 1000 * 60 * 5,
        };
      }

      // ✅ Access token still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 🔄 Access token expired → refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "job_seeker" | "employer";
        session.user.accessToken = token.accessToken as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login-register",
    error: "/login-register?error",
  },
};

export default NextAuth(authOptions);
