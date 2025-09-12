import { useNavigate } from "@tanstack/react-router";

import { authApi } from "../../shared/apis";
import LoginBtn from "../../shared/components/button/AccountBtn/LoginBtn";
import useAccessToken from "../../shared/hooks/useAccessToken";
import useUserProfile from "../../shared/hooks/useUserProfile";

const UserTemplate = () => {
  const navigate = useNavigate();
  const { clearUser } = useUserProfile();
  const { token, setToken, clearToken } = useAccessToken();

  const isLoggedIn = !!token;

  const toNew = () => {
    navigate({ to: "/new" });
  };

  const onSignout = async () => {
    const res = await authApi.postSignout();
    if (res.success) {
      clearToken();
      clearUser();
      navigate({ to: "/", replace: true });
    }
  };

  if (!isLoggedIn) return <LoginBtn setToken={setToken} />;

  return (
    <div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={toNew}>New content</button>
        <button onClick={onSignout}>Logout</button>
      </div>
    </div>
  );
};

export default UserTemplate;
