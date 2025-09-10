import { useNavigate } from "@tanstack/react-router";

import { authApi } from "../../shared/apis";
import LoginBtn from "../../shared/components/button/AccountBtn/LoginBtn";
import useAccessToken from "../../shared/hooks/useAccessToken";
import useUserProfile from "../../shared/hooks/useUserProfile";

const UserTemplate = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserProfile();
  const { token, setToken, clearToken } = useAccessToken();

  const isLoggedIn = !!token;

  const onSignout = async () => {
    const res = await authApi.postSignout();
    if (res.success) {
      clearToken();
      clearUser();
      navigate({ to: "/" });
    }
  };

  if (!isLoggedIn) return <LoginBtn setToken={setToken} />;

  return (
    <div>
      userTemplate - {user?.nickname}
      <div>
        <button onClick={onSignout}>LOGOUT</button>
      </div>
    </div>
  );
};

export default UserTemplate;
