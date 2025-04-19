import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;

export default class ApiRouteConstants {
    static LOGIN_ENDPOINT = `${URL_API}/api/login`;
  
    static TOKEN_ENDPOINT = `${URL_API}/api/token`;
  }
  