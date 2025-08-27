import ky, { HTTPError, type Options } from "ky";

import { tokenStore } from "../../states/token";
import { authManager } from "../utils/auth";

type RetryGuardOptions = Options & { _retriedOnce?: boolean };

const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  retry: {
    limit: 0,
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        await authManager.waitIfRefreshing();

        const token = tokenStore.get();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.ok) return response;

        const isAuthExpired =
          response.status === 401 || response.status === 419;
        if (!isAuthExpired) return response;

        const typed = options as RetryGuardOptions;
        if (typed._retriedOnce) {
          return response;
        }

        try {
          await authManager.ensureRefreshed(async () => {
            const res = await fetch(
              new URL("/api/auth/refresh", import.meta.env.VITE_SERVER_API_URL),
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!res.ok) {
              throw new Error(`Refresh failed with ${res.status}`);
            }
            const data = (await res.json()) as { accessToken: string };
            if (!data?.accessToken)
              throw new Error("No accessToken in refresh response");
            return data.accessToken;
          });

          const newOptions: RetryGuardOptions = {
            ...(options as Options),
            _retriedOnce: true,
          };
          return api(request, newOptions);
        } catch {
          return response;
        }
      },
    ],
  },
});

export type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

export const http = {
  get: async <T>(url: string, opts?: Options) => {
    try {
      return await api.get(url, opts).json<T>();
    } catch (e) {
      if (e instanceof HTTPError) {
        // 공통 에러 로깅/변환 필요시 여기에
      }
      throw e;
    }
  },
  post: async <T>(url: string, body?: JsonValue, opts?: Options) => {
    try {
      return await api.post(url, { json: body, ...opts }).json<T>();
    } catch (e) {
      if (e instanceof HTTPError) {
        //
      }
      throw e;
    }
  },
};

export const endpoints = {
  users: {
    me: () => "v1/users/me",
    byId: (id: number | string) => `v1/users/${id}`,
  },
  posts: {
    list: (page = 1, pageSize = 20) => ({
      path: "v1/posts",
      searchParams: { page: String(page), pageSize: String(pageSize) },
    }),
    create: () => "v1/posts",
  },
};
