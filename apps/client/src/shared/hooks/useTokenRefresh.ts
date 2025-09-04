import { useEffect } from "react";

import useAccessToken from "./useAccessToken";
import { authApi } from "../apis";

const useTokenRefresh = () => {
  const { setToken, clearToken } = useAccessToken();

  useEffect(() => {
    authApi
      .postTokenRefresh()
      .then((resp) => {
        if (resp?.success) setToken(resp.data.accessToken);
      })
      .catch(() => clearToken());
  }, [setToken, clearToken]);
};

export default useTokenRefresh;
