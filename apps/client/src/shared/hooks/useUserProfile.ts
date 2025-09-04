import { useCallback, useSyncExternalStore } from "react";

import { userStore, type TUser } from "../../states/user";

const useUserProfile = () => {
  const user = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot);
  const setUser = useCallback((newUser: TUser) => userStore.set(newUser), []);
  const clearUser = useCallback(() => userStore.clear(), []);

  return { user, setUser, clearUser };
};

export type TReturnUserProfile = ReturnType<typeof useUserProfile>;

export default useUserProfile;
