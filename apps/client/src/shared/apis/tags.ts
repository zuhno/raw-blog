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

const prefix = "tags";

export default {
  listWithCount: () => ({
    request: http.get<TListWithCountResp>,
    path: `${prefix}`,
  }),
  searchByName: (name: string) => ({
    request: http.get<TSearchByNameResp>,
    path: `${prefix}/name/${name}`,
  }),
  searchById: (id: number) => ({
    request: http.get<ISearchTagResp>,
    path: `${prefix}/id/${id}`,
  }),
};
