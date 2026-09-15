import axios from "axios";

const URL_API = process.env.NEXT_PUBLIC_URL_API;
const BASE = `${URL_API}/api/admin/visualizer`;

export interface VisualizerStats {
  samples: number;
  customerRooms: number;
  done: number;
  failed: number;
  today: number;
  avgDurationMs: number;
  dailyLimit: number;
}

export interface AdminRoom {
  _id: string;
  roomKey: string;
  roomUrl: string;
  isSample: boolean;
  isActive: boolean;
  title?: string;
  ip?: string;
  source?: string;
  renders: number;
  done: number;
  createdAt: string;
}

export interface AdminRender {
  _id: string;
  roomKey: string;
  roomUrl: string;
  isSample: boolean;
  productId?: string;
  resultKey?: string;
  resultUrl?: string;
  status: "pending" | "done" | "failed";
  error?: string;
  durationMs?: number;
  aiModel?: string;
  source?: string;
  createdAt: string;
  product: { _id: string; name: string; model?: string; image?: string; category?: string } | null;
}

export interface Paged<T> { items: T[]; pagination: { page: number; limit: number; total: number; pages: number } }

const auth = (session: { accessToken?: string } | null) => ({ headers: { Authorization: `Bearer ${session?.accessToken ?? ""}` } });

export default class adminVisualizerServices {
  static async stats(session: { accessToken?: string } | null): Promise<VisualizerStats> {
    const { data } = await axios.get(`${BASE}/stats`, auth(session));
    return data.stats;
  }

  static async rooms(session: { accessToken?: string } | null, type: "sample" | "customer", page = 1, limit = 24): Promise<Paged<AdminRoom>> {
    const { data } = await axios.get(`${BASE}/rooms`, { ...auth(session), params: { type, page, limit } });
    return { items: data.rooms, pagination: data.pagination };
  }

  static async renders(session: { accessToken?: string } | null, params: { roomKey?: string; status?: string; page?: number; limit?: number }): Promise<Paged<AdminRender>> {
    const { data } = await axios.get(`${BASE}/renders`, { ...auth(session), params });
    return { items: data.renders, pagination: data.pagination };
  }

  static async uploadSample(session: { accessToken?: string } | null, file: File, title?: string) {
    const form = new FormData();
    form.append("photo", file);
    if (title) form.append("title", title);
    const { data } = await axios.post(`${BASE}/samples`, form, auth(session));
    return data.room as AdminRoom;
  }

  static async generateSample(session: { accessToken?: string } | null, prompt?: string, title?: string) {
    const { data } = await axios.post(`${BASE}/samples/generate`, { prompt, title }, { ...auth(session), timeout: 180000 });
    return data.room as AdminRoom;
  }

  static async updateRoom(session: { accessToken?: string } | null, id: string, patch: { isActive?: boolean; title?: string }) {
    const { data } = await axios.patch(`${BASE}/rooms/${id}`, patch, auth(session));
    return data.room as AdminRoom;
  }

  static async deleteRoom(session: { accessToken?: string } | null, id: string) {
    await axios.delete(`${BASE}/rooms/${id}`, auth(session));
  }

  static async render(session: { accessToken?: string } | null, roomKey: string, productId: string, force = false) {
    const { data } = await axios.post(`${BASE}/render`, { roomKey, productId, force }, { ...auth(session), timeout: 180000 });
    return data.render as AdminRender;
  }

  static async regenerate(session: { accessToken?: string } | null, id: string) {
    const { data } = await axios.post(`${BASE}/renders/${id}/regenerate`, {}, { ...auth(session), timeout: 180000 });
    return data.render as AdminRender;
  }

  static async deleteRender(session: { accessToken?: string } | null, id: string) {
    await axios.delete(`${BASE}/renders/${id}`, auth(session));
  }
}
