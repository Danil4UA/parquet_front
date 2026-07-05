import userServices from "@/services/userServices";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Refresh the access token slightly before it actually expires
const REFRESH_BUFFER_MS = 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(userServices.REFRESH_ENDPOINT, {
      refreshToken: token.refreshToken,
    });

    return {
      ...token,
      accessToken: response.data.accessToken,
      accessTokenExpires: response.data.accessTokenExpires,
      refreshToken: response.data.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", axios.isAxiosError(error) ? error.response?.data : error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const loginResponse = await axios.post(userServices.LOGIN_ENDPOINT, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (loginResponse.data?.accessToken) {
            return {
              id: loginResponse.data.user.id,
              name: loginResponse.data.user.username || loginResponse.data.user.email,
              email: loginResponse.data.user.email,
              accessToken: loginResponse.data.accessToken,
              accessTokenExpires: loginResponse.data.accessTokenExpires,
              refreshToken: loginResponse.data.refreshToken,
            };
          }

          return null;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
          }
          console.error("Auth error:", axios.isAxiosError(error) ? error.message : error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Initial sign-in: persist tokens from the backend
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          accessTokenExpires: user.accessTokenExpires,
          refreshToken: user.refreshToken,
        };
      }

      // Access token still valid — keep the session as is
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - REFRESH_BUFFER_MS) {
        return token;
      }

      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (!session.user) session.user = {};

      session.user.id = token.sub;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;
