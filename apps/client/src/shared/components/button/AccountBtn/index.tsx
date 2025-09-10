import UserBtn from "./UserBtn";
import useAccessToken from "../../../hooks/useAccessToken";

const AccountBtn = () => {
  const { token } = useAccessToken();
  const isLoggedIn = !!token;

  if (!isLoggedIn) return null;

  return <UserBtn />;
};

export default AccountBtn;
