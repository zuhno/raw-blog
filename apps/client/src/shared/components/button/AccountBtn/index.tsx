import LoginBtn from "./LoginBtn";
import UserBtn from "./UserBtn";
import useAccessToken from "../../../hooks/useAccessToken";

const AccountBtn = () => {
  const { token, setToken } = useAccessToken();
  const isLoggedIn = !!token;

  return isLoggedIn ? <UserBtn /> : <LoginBtn setToken={setToken} />;
};

export default AccountBtn;
