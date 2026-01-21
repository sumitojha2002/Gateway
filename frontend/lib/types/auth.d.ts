import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string;
      name?: string;
      role?: "job_seeker" | "employer";
      accessToken?: string;
    };
    error?: string;
  }

  interface User {
    id: string;
    role?: "job_seeker" | "employer";
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "job_seeker" | "employer";
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
