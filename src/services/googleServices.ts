import axios from "axios";
import "dotenv/config";

const URL_API = process.env.NEXT_PUBLIC_URL_API;

class GoogleService {
    static GET_ALL_REVIEWS_ENDPOINT  = `${URL_API}/api/reviews`;

    static getAllReviews = async (lng: { lng: string }) => {
        try {
            return await axios.get(`${GoogleService.GET_ALL_REVIEWS_ENDPOINT}?lng=${lng}`);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }
}

export default GoogleService;
