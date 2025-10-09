import ky, { HTTPError, type Options } from "ky";

import { tokenStore } from "../../states/token";
import { authManager } from "../utils/auth";

export type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | FormData
  | null;

type HttpErrorBody =
  | string
  | {
      statusCode?: number;
      message?: string | string[];
      error?: string;
      code?: string;
      [key: string]: unknown;
    };

type Ok<T> = { success: true; data: T; error?: never };
type Err = { success: false; error: HttpErrorBody; data?: never };
type ICommonRespType<T> = Ok<T> | Err;
type RetryGuardOptions = Options & { _retriedOnce?: boolean };

const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_API_URL,
  credentials: "include",
  retry: {
    limit: 0,
  },
  keepalive: true,
  hooks: {
    beforeRequest: [
      async (request) => {
        await authManager.waitIfRefreshing();

        const token = tokenStore.getSnapshot();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.ok) return response;

        const isAuthExpired = response.status === 401;
        if (!isAuthExpired) return response;

        const typed = options as RetryGuardOptions;
        if (typed._retriedOnce) {
          return response;
        }

        try {
          await authManager.ensureRefreshed(async () => {
            const res = await fetch(
              new URL(
                "auth/refresh",
                import.meta.env.VITE_SERVER_API_URL + "/"
              ),
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!res.ok) {
              throw new Error(`Refresh failed with ${res.status}`);
            }
            const resJson = (await res.json()) as {
              success: boolean;
              data: { accessToken: string };
            };
            if (!resJson?.data?.accessToken)
              throw new Error("No accessToken in refresh response");

            return resJson.data.accessToken;
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

export const http = {
  get: async <T>(url: string, opts?: Options) => {
    try {
      return await api.get(url, opts).json<ICommonRespType<T>>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw await error.response.json();
      }
      throw error;
    }
  },
  post: async <T>(url: string, body?: JsonValue, opts?: Options) => {
    try {
      const isFormData = body instanceof FormData;
      return await api
        .post(url, { ...(isFormData ? { body } : { json: body }), ...opts })
        .json<ICommonRespType<T>>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw await error.response.json();
      }
      throw error;
    }
  },
  patch: async <T>(url: string, body?: JsonValue, opts?: Options) => {
    try {
      const isFormData = body instanceof FormData;
      return await api
        .patch(url, { ...(isFormData ? { body } : { json: body }), ...opts })
        .json<ICommonRespType<T>>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw await error.response.json();
      }
      throw error;
    }
  },
  delete: async <T>(url: string, opts?: Options) => {
    try {
      return await api.delete(url, { ...opts }).json<ICommonRespType<T>>();
    } catch (error) {
      if (error instanceof HTTPError) {
        throw await error.response.json();
      }
      throw error;
    }
  },
};
