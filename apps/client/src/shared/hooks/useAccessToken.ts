import { useCallback, useSyncExternalStore } from "react";

import { tokenStore } from "../../states/token";

const useAccessToken = () => {
  const token = useSyncExternalStore(
    tokenStore.subscribe,
    tokenStore.getSnapshot
  );
  const setToken = useCallback(
    (newToken: string) => tokenStore.set(newToken),
    []
  );
  const clearToken = useCallback(() => tokenStore.clear(), []);

  return { token, setToken, clearToken };
};

export type TReturnAccessToken = ReturnType<typeof useAccessToken>;

export default useAccessToken;
