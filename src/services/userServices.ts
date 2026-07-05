import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import axios from "axios";


export default class userServices {
    static USER_ENDPOINT = `${URL_API}/api/user`;

    static LOGIN_ENDPOINT = `${URL_API}/api/user/login`;

    static REFRESH_ENDPOINT = `${URL_API}/api/user/refresh`;

    static LOGOUT_ENDPOINT = `${URL_API}/api/user/logout`;

    static async login(email: string, password: string) {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        return { success: true as const };
      }
      return { success: false as const, message: res?.error || "Login failed" };
    }

    static async getUser(session: Session) {
      const { accessToken } = session;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      return await axios.get(userServices.USER_ENDPOINT, config);
    }

    // Revoke the refresh token on the backend; callers handle signOut/redirects
    static async revokeRefreshToken(session: Session | null) {
      if (!session?.refreshToken) return;
      try {
        await axios.post(userServices.LOGOUT_ENDPOINT, {
          refreshToken: session.refreshToken,
        });
      } catch (error) {
        console.error("Logout revoke error:", error);
      }
    }
}
