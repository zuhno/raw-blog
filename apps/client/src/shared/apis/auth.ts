import { http } from "../configs/api";

interface IExchangeGoogleCodeResp {
  accessToken: string;
}

interface ITokenRefreshResp {
  accessToken: string;
}

const prefix = "auth";

export default {
  exchangeGoogleCode: (code: string) => ({
    request: http.post<IExchangeGoogleCodeResp>,
    path: `${prefix}/google/exchange`,
    body: { code },
    headers: {
      "X-Requested-With": "XmlHttpRequest",
      "Content-Type": "application/json",
    },
  }),
  tokenRefresh: () => ({
    request: http.post<ITokenRefreshResp>,
    path: `${prefix}/refresh`,
  }),
  signout: () => ({ request: http.post, path: `${prefix}/signout` }),
};
