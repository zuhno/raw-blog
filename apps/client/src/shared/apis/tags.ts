import { http } from "../configs/api";

type TSearchByNameResp = { id: number; name: string }[];

export default {
  searchByName: (name: string) => ({
    request: http.get<TSearchByNameResp>,
    path: "tags",
    searchParams: new URLSearchParams({ name }),
  }),
};
