import { http } from "../configs/api";

const prefix = "visitors";

export default {
  log: () => ({
    request: http.post,
    path: `${prefix}/log`,
  }),
};
