import { http } from "../configs/api";

export default {
  searchByName: (name: string) => ({
    request: http.get,
    path: "/tags",
    searchParams: new URLSearchParams({ name }),
  }),
};
