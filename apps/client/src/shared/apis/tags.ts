import { http } from "../configs/api";

interface ISearchTagResp {
  id: number;
  name: string;
}

export default {
  searchByName: (name: string) => ({
    request: http.get<ISearchTagResp[]>,
    path: `tags/name/${name}`,
  }),
  searchById: (id: number) => ({
    request: http.get<ISearchTagResp>,
    path: `tags/id/${id}`,
  }),
};
