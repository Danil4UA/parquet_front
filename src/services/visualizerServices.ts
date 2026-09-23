import axios from "axios";

const URL_API = process.env.NEXT_PUBLIC_URL_API;
const BASE = `${URL_API}/api/visualizer`;

/** A sample room offered by the shop (stored on the server). */
export interface SampleRoom {
  kind: "sample";
  roomKey: string;
  roomUrl: string;
  title?: string;
}

/** The shopper's own photo. Lives only in the browser; the server never stores it. */
export interface PhotoRoom {
  kind: "photo";
  file: File;
  previewUrl: string;
}

export type VisualizerRoom = SampleRoom | PhotoRoom;

export interface VisualizerResult {
  /** Image to display: an https URL for sample rooms, a data: URL for customer photos. */
  src: string;
  productId: string;
  durationMs?: number;
  cached: boolean;
  /** Present for sample-room results only (they are stored and can be proxied for download). */
  resultKey?: string;
}

export const roomPreviewUrl = (room: VisualizerRoom) => (room.kind === "sample" ? room.roomUrl : room.previewUrl);

export default class visualizerServices {
  static async getSamples(): Promise<SampleRoom[]> {
    const { data } = await axios.get(`${BASE}/samples`);
    return ((data.rooms || []) as Omit<SampleRoom, "kind">[]).map((r) => ({ kind: "sample", ...r }));
  }

  /** Same-app URL that serves a stored (sample) result with an attachment header. */
  static downloadUrl(resultKey: string, name: string) {
    return `${BASE}/download?key=${encodeURIComponent(resultKey)}&name=${encodeURIComponent(name)}`;
  }

  /**
   * Renders a product into a room. For a customer photo the file is sent with the request
   * and the result comes back inline; nothing is kept on the server.
   */
  static async render(room: VisualizerRoom, productId: string): Promise<VisualizerResult> {
    const form = new FormData();
    form.append("productId", productId);
    if (room.kind === "photo") form.append("photo", room.file);
    else form.append("roomKey", room.roomKey);

    const { data } = await axios.post(`${BASE}/render`, form, { timeout: 180000 });
    const r = data.result;
    return {
      src: r.image || r.resultUrl,
      productId: r.productId,
      durationMs: r.durationMs,
      cached: !!r.cached,
      resultKey: r.resultKey,
    };
  }

  /**
   * Server-side conversion for photos the browser cannot decode (e.g. HEIC on a desktop):
   * returns an upright, resized JPEG. No AI involved, nothing is stored.
   */
  static async prepareOnServer(file: File): Promise<File> {
    const form = new FormData();
    form.append("photo", file);
    const { data } = await axios.post<Blob>(`${BASE}/prepare`, form, { responseType: "blob", timeout: 60000 });
    const name = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([data], `${name}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  }

  /** Fetches the result as a Blob (works for both data: and https: sources). */
  static async resultBlob(result: VisualizerResult, fileName: string): Promise<Blob> {
    const url = result.resultKey ? visualizerServices.downloadUrl(result.resultKey, fileName) : result.src;
    return (await fetch(url)).blob();
  }
}
