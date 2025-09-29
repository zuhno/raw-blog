import { useNavigate } from "@tanstack/react-router";
import { useReducer, useState } from "react";

import DateRange from "./components/DateRange";
import VisitorChart from "./components/VisitorChart";
import { authApi } from "../../shared/apis";
import LoginBtn from "../../shared/components/button/AccountBtn/LoginBtn";
import ContentList from "../../shared/components/list/ContentList";
import useAccessToken from "../../shared/hooks/useAccessToken";
import useUserProfile from "../../shared/hooks/useUserProfile";
import { formatKebabcaseDate } from "../../shared/utils/date";

const UserTemplate = () => {
  const navigate = useNavigate();
  const { clearUser } = useUserProfile();
  const { token, setToken, clearToken } = useAccessToken();
  const [isAnalysis, toggleAnalysis] = useReducer((state) => !state, false);
  const [end, setEnd] = useState(() => formatKebabcaseDate(new Date()));
  const [start, setStart] = useState(() =>
    formatKebabcaseDate(
      new Date(new Date().setMonth(new Date().getMonth() - 1))
    )
  );

  const isLoggedIn = !!token;

  const setDate = (type: "start" | "end", value: string) => {
    if (type === "start") setStart(value);
    else setEnd(value);
  };

  const toNew = () => {
    navigate({ to: "/new" });
  };

  const toggleShowAnalysis = () => {
    toggleAnalysis();
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
      <p style={{ display: "flex", gap: 10 }}>
        <button onClick={toggleShowAnalysis}>
          {isAnalysis ? "Content list" : "Analysis"}
        </button>
        <button onClick={toNew}>New content</button>
        <button onClick={onSignout}>Logout</button>
      </p>
      {isAnalysis ? (
        <>
          <DateRange start={start} end={end} setDate={setDate} />
          <VisitorChart start={start} end={end} />
        </>
      ) : (
        <ContentList type="ALL" showLabel isOwner />
      )}
    </div>
  );
};

export default UserTemplate;
