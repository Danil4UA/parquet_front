import axios from "axios";

const URL_API = process.env.NEXT_PUBLIC_URL_API;
const BASE = `${URL_API}/api/admin/visualizer`;

export interface StatsBucket {
  done: number;
  failed: number;
  costUsd: number;
}

export interface VisualizerStats {
  today: StatsBucket & { used: number; limit: number };
  last7d: StatsBucket & { successRate: number | null };
  last30d: StatsBucket;
  allTime: StatsBucket & { avgCostUsd: number | null };
  avgDurationMs: number;
  samples: number;
  storedCustomerImages: number;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  recentFailures: RecentFailure[];
  config: { provider: string; model: string; quality: string; inputFidelity: string; referenceImages: number; roomMaxSide: number };
  limits: { perIp: number; perIpWindowHours: number; daily: number };
  topIpsToday: { _id: string; count: number; failed: number }[];
  warnings: string[];
}

export interface RecentFailure {
  _id: string;
  createdAt: string;
  error?: string;
  errorKind?: string;
  productId?: string;
  source?: string;
  isSample: boolean;
  durationMs?: number;
  product: RenderProduct | null;
}

export interface RenderProduct { _id: string; name: string; model?: string; image?: string; category?: string }

export interface AdminRoom {
  _id: string;
  roomKey: string;
  roomUrl: string;
  isSample: boolean;
  isActive: boolean;
  title?: string;
  source?: string;
  renders: number;
  done: number;
  createdAt: string;
}

export interface AdminRender {
  _id: string;
  roomKey?: string;
  roomUrl?: string;
  isSample: boolean;
  productId?: string;
  resultKey?: string;
  resultUrl?: string;
  status: "pending" | "done" | "failed";
  error?: string;
  errorKind?: string;
  durationMs?: number;
  aiModel?: string;
  quality?: string;
  estimatedCostUsd?: number;
  usage?: { inputTextTokens: number; inputImageTokens: number; outputTokens: number };
  source?: string;
  createdAt: string;
  product: RenderProduct | null;
}

export interface Paged<T> { items: T[]; pagination: { page: number; limit: number; total: number; pages: number } }

type Session = { accessToken?: string } | null;
const auth = (session: Session) => ({ headers: { Authorization: `Bearer ${session?.accessToken ?? ""}` } });

export default class adminVisualizerServices {
  static async stats(session: Session): Promise<VisualizerStats> {
    const { data } = await axios.get(`${BASE}/stats`, auth(session));
    return data.stats;
  }

  static async rooms(session: Session, page = 1, limit = 24): Promise<Paged<AdminRoom>> {
    const { data } = await axios.get(`${BASE}/rooms`, { ...auth(session), params: { page, limit } });
    return { items: data.rooms, pagination: data.pagination };
  }

  static async renders(session: Session, params: { roomKey?: string; status?: string; kind?: "customer" | "sample"; page?: number; limit?: number }): Promise<Paged<AdminRender>> {
    const { data } = await axios.get(`${BASE}/renders`, { ...auth(session), params });
    return { items: data.renders, pagination: data.pagination };
  }

  static async uploadSample(session: Session, file: File, title?: string) {
    const form = new FormData();
    form.append("photo", file);
    if (title) form.append("title", title);
    const { data } = await axios.post(`${BASE}/samples`, form, auth(session));
    return data.room as AdminRoom;
  }

  static async generateSample(session: Session, prompt?: string, title?: string) {
    const { data } = await axios.post(`${BASE}/samples/generate`, { prompt, title }, { ...auth(session), timeout: 180000 });
    return data.room as AdminRoom;
  }

  static async updateRoom(session: Session, id: string, patch: { isActive?: boolean; title?: string }) {
    const { data } = await axios.patch(`${BASE}/rooms/${id}`, patch, auth(session));
    return data.room as AdminRoom;
  }

  static async deleteRoom(session: Session, id: string) {
    await axios.delete(`${BASE}/rooms/${id}`, auth(session));
  }

  static async render(session: Session, roomKey: string, productId: string, force = false) {
    const { data } = await axios.post(`${BASE}/render`, { roomKey, productId, force }, { ...auth(session), timeout: 180000 });
    return data.render as AdminRender;
  }

  static async regenerate(session: Session, id: string) {
    const { data } = await axios.post(`${BASE}/renders/${id}/regenerate`, {}, { ...auth(session), timeout: 180000 });
    return data.render as AdminRender;
  }

  static async deleteRender(session: Session, id: string) {
    await axios.delete(`${BASE}/renders/${id}`, auth(session));
  }

  /** Hides failed generations from the "Recent errors" block; counters and records are kept. */
  static async acknowledgeFailures(session: Session, ids?: string[]): Promise<number> {
    const { data } = await axios.post(`${BASE}/failures/acknowledge`, { ids }, auth(session));
    return data.acknowledged;
  }

  /** One-time cleanup of customer photos stored before the privacy change. */
  static async purgeCustomerImages(session: Session): Promise<{ files: number; rooms: number; renders: number }> {
    const { data } = await axios.delete(`${BASE}/customer-images`, { ...auth(session), timeout: 300000 });
    return data;
  }
}
