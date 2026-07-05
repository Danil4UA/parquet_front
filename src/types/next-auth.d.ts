import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: "RefreshAccessTokenError";
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }
}
