import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { usersApi } from "../../../apis";
import useUserProfile from "../../../hooks/useUserProfile";

const UserBtn = () => {
  const { user, setUser } = useUserProfile();

  useEffect(() => {
    usersApi.getMe().then((resp) => {
      if (resp.success) setUser(resp.data);
    });
  }, [setUser]);

  if (!user) return null;

  return (
    <Link to="/me">
      <img src={user.avatarUrl} alt="" style={{ width: 40, height: 40 }} />
    </Link>
  );
};

export default UserBtn;
