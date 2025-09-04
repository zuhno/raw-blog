import useUserProfile from "../../shared/hooks/useUserProfile";

const UserTemplate = () => {
  const { user } = useUserProfile();

  return <div>userTemplate - {user?.nickname}</div>;
};

export default UserTemplate;
