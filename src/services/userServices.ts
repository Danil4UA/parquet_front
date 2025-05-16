import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;
import { signIn } from "next-auth/react";
import axios from "axios";


export default class userServices {
    static USER_ENDPOINT = `${URL_API}/api/user`;

    static LOG_OUT_ROUTE = `${URL_API}/api/user/logout`;

    static LOGIN_ENDPOINT = `${URL_API}/api/user/login`;

    static REGISTER_USER = `${URL_API}/user/register`;

    static CONTACT_US_ENDPOINT = `${URL_API}/api/contact`;


    static async login(email: string, password: string) {
      try {
        
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
            
        if (res?.ok) {
          return { data: { success: true } };
        } else {
          return { data: { success: false, message: res?.error || "Login failed" } };
        }
      } catch (error) {
        throw error;
      }
    }

    static async getUser(session: any) {
      const { accessToken } = session
      try {
          const config = {
            headers: { authorization: accessToken },
          };
          return await axios.get(userServices.USER_ENDPOINT, config);
      } catch (error) {
          console.log(error);
          throw error;
      }
    }

    static async logOut(session: any) {
        const { accessToken, refreshToken } = session
        const config = {
          headers: { authorization: accessToken },
          params: {
            refresh_token: refreshToken,
          },
        };

        try {
          return await axios.delete(this.LOG_OUT_ROUTE, config);
        } catch (error) {
          console.log(error);
          throw error;
        }
    }

    static async contactUs(data: any) {
      try {
        const response = await axios.post(this.CONTACT_US_ENDPOINT, data);
        return response.data;
      } catch (error) {
        console.error("Error sending contact form:", error);
        throw error;
      }
    }
}
