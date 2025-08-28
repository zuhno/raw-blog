import { http } from "../configs/api";

export default {
  exchangeGoogleCode: (code: string) => ({
    request: http.post,
    path: "/auth/google/exchange",
    body: { code },
    headers: {
      "X-Requested-With": "XmlHttpRequest",
      "Content-Type": "application/json",
    },
  }),
  tokenRefresh: () => ({ request: http.post, path: "/auth/refresh" }),
  signout: () => ({ request: http.post, path: "/auth/signout" }),
};
