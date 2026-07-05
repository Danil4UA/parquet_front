import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

// The access token lives 15 minutes; the client-side session only refreshes on
// window focus, so long-lived pages end up sending an expired token. This
// interceptor catches the resulting 401, forces a session refresh (NextAuth
// rotates the tokens via /api/user/refresh) and retries the request once.

let installed = false;
let refreshPromise: Promise<Session | null> | null = null;

// Concurrent 401s share one getSession() call instead of stampeding the refresh endpoint
const getFreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = getSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

type RetriableConfig = InternalAxiosRequestConfig & { _authRetry?: boolean };

export default function setupAxiosAuthRefresh() {
  if (installed) return;
  installed = true;

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined;
      const hadAuthHeader = Boolean(original?.headers?.Authorization);

      if (error.response?.status === 401 && original && hadAuthHeader && !original._authRetry) {
        original._authRetry = true;

        const session = await getFreshSession();

        if (session?.accessToken && !session.error) {
          original.headers.Authorization = `Bearer ${session.accessToken}`;
          return axios(original);
        }

        // Refresh failed — the refresh token is gone/revoked, force a clean re-login
        await signOut({ callbackUrl: "/login" });
      }

      return Promise.reject(error);
    }
  );
}
