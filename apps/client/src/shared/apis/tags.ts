import { http } from "../configs/api";

interface ISearchTagResp {
  id: number;
  name: string;
}
type TSearchByNameResp = ISearchTagResp[];
type TListWithCountResp = {
  id: number;
  name: string;
  contentsCount: number;
}[];

export default {
  listWithCount: () => ({
    request: http.get<TListWithCountResp>,
    path: `tags`,
  }),
  searchByName: (name: string) => ({
    request: http.get<TSearchByNameResp>,
    path: `tags/name/${name}`,
  }),
  searchById: (id: number) => ({
    request: http.get<ISearchTagResp>,
    path: `tags/id/${id}`,
  }),
};
