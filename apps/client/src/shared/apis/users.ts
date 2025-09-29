import { http } from "../configs/api";

interface IMeResp {
  id: number;
  nickname: string;
  email: string;
  avatarUrl: string;
}

const prefix = "users";

export default {
  me: () => ({ request: http.get<IMeResp>, path: `${prefix}/me` }),
};
