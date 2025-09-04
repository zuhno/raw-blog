import { http } from "../configs/api";

interface IMeResp {
  id: number;
  nickname: string;
  email: string;
  avatarUrl: string;
}

export default {
  me: () => ({ request: http.get<IMeResp>, path: "users/me" }),
};
