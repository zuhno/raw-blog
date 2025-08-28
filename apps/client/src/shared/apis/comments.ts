import { http } from "../configs/api";

export default {
  create: (data: { contentId: number; parentId?: number; text: string }) => ({
    request: http.post,
    path: "/comments",
    body: data,
  }),
  list: (id: number) => ({
    request: http.get,
    path: "/comments",
    searchParam: new URLSearchParams({ contentId: String(id) }),
  }),
  update: (id: number, data: { text: string }) => ({
    request: http.patch,
    path: `/comments/${id}`,
    body: data,
  }),
  remove: (id: number) => ({
    request: http.delete,
    path: `/comments/${id}`,
  }),
};
