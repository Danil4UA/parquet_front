import axios from "axios";
import "dotenv/config";
const URL_API = process.env.NEXT_PUBLIC_URL_API;

export default class photosServices {
    static PHOTO_ENDPOINT = `${URL_API}/api/photos/`;

    static UPLOAD_SINGLE_PHOTO_ENDPOINT = `${URL_API}/api/photos/upload`;

    static UPLOAD_MULTIPLE_PHOTOS_ENDPOINT = `${URL_API}/api/photos/upload-multiple`;

    static async uploadSinglePhoto (session: any, photoData) {
        const { accessToken } = session ?? {};

        const config = {
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            }
        };

        try {
            return await axios.post(
                photosServices.UPLOAD_SINGLE_PHOTO_ENDPOINT,
                photoData,
                config);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async uploadMultiplePhoto (session: any, photoData) {
        const { accessToken } = session ?? {};

        const config = {
            headers: { 
                Authorization: `Bearer ${accessToken}`,
            }
        };
        try {
            return await axios.post(
                photosServices.UPLOAD_MULTIPLE_PHOTOS_ENDPOINT,
                photoData,
                config);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async deletePhoto () {

    }
}