import { http } from "../configs/api";

interface IExchangeGoogleCodeResp {
  accessToken: string;
}

interface ITokenRefreshResp {
  accessToken: string;
}

export default {
  exchangeGoogleCode: (code: string) => ({
    request: http.post<IExchangeGoogleCodeResp>,
    path: "auth/google/exchange",
    body: { code },
    headers: {
      "X-Requested-With": "XmlHttpRequest",
      "Content-Type": "application/json",
    },
  }),
  tokenRefresh: () => ({
    request: http.post<ITokenRefreshResp>,
    path: "auth/refresh",
  }),
  signout: () => ({ request: http.post, path: "auth/signout" }),
};
