import { http } from "../configs/api";

interface IComment {
  id: number;
  authorId: number;
  contentId: number;
  parentId?: number;
  text: string;
}
interface ICreateResp extends IComment {}
interface IUpdateResp extends IComment {}
interface IRemoveResp extends IComment {}
interface IListItem extends IComment {
  author: { id: number; nickname: string; avatarUrl?: string };
  children: IListItem[];
}
type TListResp = IListItem[];

const prefix = "comments";

export default {
  create: (data: { contentId: number; parentId?: number; text: string }) => ({
    request: http.post<ICreateResp>,
    path: `${prefix}`,
    body: data,
  }),
  list: (id: number) => ({
    request: http.get<TListResp>,
    path: `${prefix}`,
    searchParam: new URLSearchParams({ contentId: String(id) }),
  }),
  update: (id: number, data: { text: string }) => ({
    request: http.patch<IUpdateResp>,
    path: `${prefix}/${id}`,
    body: data,
  }),
  remove: (id: number) => ({
    request: http.delete<IRemoveResp>,
    path: `${prefix}/${id}`,
  }),
};
