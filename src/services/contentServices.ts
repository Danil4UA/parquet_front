import "dotenv/config";
import axios from "axios";
import type { Session } from "next-auth";

const URL_API = process.env.NEXT_PUBLIC_URL_API;

export interface SiteContent {
  hero_slider?: string[];
  category_images?: Record<string, string>;
}

export default class contentServices {
  static CONTENT_ENDPOINT = `${URL_API}/api/content`;

  static async getContent() {
    return await axios.get<SiteContent>(contentServices.CONTENT_ENDPOINT);
  }

  static async updateContent(
    session: Session | null,
    key: "hero_slider" | "category_images",
    value: string[] | Record<string, string>,
  ) {
    const { accessToken } = session ?? {};
    return await axios.put(
      `${contentServices.CONTENT_ENDPOINT}/${key}`,
      { value },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }
}
