import "dotenv/config";
import axios from "axios";
import type { Session } from "next-auth";

const URL_API = process.env.NEXT_PUBLIC_URL_API;

/** Editable content slots (admin "Homepage" page). Every field is optional: missing = site default. */
export interface SiteContent {
  /** Photo behind the headline of the home page; null/missing = the site's default photo. */
  hero_image?: string | null;
  /** Legacy slider from the old home page; no longer shown. */
  hero_slider?: string[];
  /** Photos of the category tiles, keyed by slug (wood, laminate, spc, cladding, sales…). */
  category_images?: Record<string, string>;
  /** Id of the sample-room render in the before/after demo; null/missing = the latest one. */
  home_showcase?: string | null;
  /** Hand-picked product ids for "Most chosen"; empty = automatic. */
  home_popular?: string[];
  /** Hand-picked product ids for "Our work"; empty = automatic. */
  home_works?: string[];
}

export type SiteContentKey = keyof SiteContent;

export default class contentServices {
  static CONTENT_ENDPOINT = `${URL_API}/api/content`;

  static async getContent() {
    return await axios.get<SiteContent>(contentServices.CONTENT_ENDPOINT);
  }

  static async updateContent<K extends SiteContentKey>(session: Session | null, key: K, value: SiteContent[K]) {
    const { accessToken } = session ?? {};
    return await axios.put(
      `${contentServices.CONTENT_ENDPOINT}/${key}`,
      { value },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }
}
