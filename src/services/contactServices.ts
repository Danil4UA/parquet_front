import "dotenv/config";
import axios from "axios";
const URL_API = process.env.NEXT_PUBLIC_URL_API;

export default class contactServices {
    static CONTACT_US_ENDPOINT = `${URL_API}/api/contact`;

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