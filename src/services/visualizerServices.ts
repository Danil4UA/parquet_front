import axios from "axios";

const URL_API = process.env.NEXT_PUBLIC_URL_API;
const BASE = `${URL_API}/api/visualizer`;

export interface VisualizerRoom {
  roomKey: string;
  roomUrl: string;
  title?: string;
}

export interface VisualizerResult {
  resultUrl: string;
  resultKey: string;
  roomUrl: string;
  productId: string;
  durationMs?: number;
  cached: boolean;
}

export default class visualizerServices {
  static async uploadRoom(file: File): Promise<VisualizerRoom> {
    const form = new FormData();
    form.append("photo", file);
    const { data } = await axios.post(`${BASE}/rooms`, form, { headers: { "Content-Type": "multipart/form-data" } });
    return data.room as VisualizerRoom;
  }

  static async getSamples(): Promise<VisualizerRoom[]> {
    const { data } = await axios.get(`${BASE}/samples`);
    return (data.rooms || []) as VisualizerRoom[];
  }

  /** Same-app URL that serves the result with an attachment header (S3 itself has no CORS). */
  static downloadUrl(resultKey: string, name: string) {
    return `${BASE}/download?key=${encodeURIComponent(resultKey)}&name=${encodeURIComponent(name)}`;
  }

  static async render(roomKey: string, productId: string): Promise<VisualizerResult> {
    const { data } = await axios.post(`${BASE}/render`, { roomKey, productId }, { timeout: 180000 });
    return data.result as VisualizerResult;
  }
}
