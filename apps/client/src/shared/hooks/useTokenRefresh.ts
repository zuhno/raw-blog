import { useEffect } from "react";

import useAccessToken from "./useAccessToken";
import { authApi } from "../apis";

const useTokenRefresh = () => {
  const { setToken } = useAccessToken();

  useEffect(() => {
    console.log("123");
    authApi.postTokenRefresh().then((resp) => {
      if (resp?.success) setToken(resp.data.accessToken);
    });
  }, [setToken]);
};

export default useTokenRefresh;
