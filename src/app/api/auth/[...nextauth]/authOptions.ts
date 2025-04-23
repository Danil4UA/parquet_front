import userServices from "@/services/userServices";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
            const payload = {
                email: credentials?.email,
                password: credentials?.password,
            };
            
            console.log("Attempting login with", payload);

            const loginResponse = await axios.post(userServices.LOGIN_ENDPOINT, payload);
            console.log("Login response", loginResponse.data);

            if (loginResponse.data) {
              return {
                id: loginResponse.data.user.id,
                name: loginResponse.data.user.username || loginResponse.data.user.email,
                email: loginResponse.data.user.email,
                accessToken: loginResponse.data.accessToken,
                refreshToken: loginResponse.data.refreshToken,
              };
            }
            
            return null;
        } catch (error) {
          console.error("Auth error:", error);
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
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }
      
      return token;
    },
    session: async ({ session, token }: { session: any, token: any }) => {
      if (!session.user) session.user = {};

      if (token) {
        session.user.id = token.sub;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;