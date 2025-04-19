import ApiRouteConstants from "@/constants/ApiRouteConstants";
import userServices from "@/services/userServices";
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
            const payload = {
                email: credentials?.username,
                password: credentials?.password,
            };

            const loginResponse = await axios.post(ApiRouteConstants.LOGIN_ENDPOINT, payload);

            const {
                AccessToken: accessToken,
            } = loginResponse.data.AuthenticationResult;
            
            const getUserResponse = await userServices.getUser(accessToken);
            const role = getUserResponse.data.role;
            return {    
                accessToken,
                role,
                expires_at: Date.now() + loginResponse.data.AuthenticationResult.ExpiresIn * 1000,
              };
          
        } catch (error) {
          console.error("Error", error);
          throw error;
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
          role: user.role,
        };
      }
      
      return token;
    },
    session: async ({ session, token }) => {
    if (!session.user) session.user = {};

      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export default authOptions;
