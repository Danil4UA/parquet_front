import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;
import { signIn } from "next-auth/react";
import RouteConstants from "@/constants/RouteConstants";
import axios from "axios";


export default class userServices {
    static USER_ENDPOINT = `${URL_API}/user`;

    static LOG_OUT_ROUTE = `${URL_API}/user/logout`;

    static async login(username, password, router, setIsLoginApiLoading) {
        try {
          setIsLoginApiLoading(true);
          const res = await signIn(
            "credentials",
            {
              redirect: false,
              username,
              password,
            },
          );
    
          if (res?.status === 200) {
            router.push(RouteConstants.ADMIN_ROUTE);
          } else {
            throw res;
          }
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        setIsLoginApiLoading(false);
      }

    static async getUser(accessToken) {
        try {
            const config = {
            headers: { authorization: accessToken },
            };

            return await axios.get(this.USER_ENDPOINT, config);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async logOut(accessToken, refreshToken) {
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
    
}
