import { endpoints, http } from "../configs/api";

export const usersApi = {
  getMe: () => http.get<{ id: number; email: string }>(endpoints.users.me()),
  getById: (id: number | string) =>
    http.get<{ id: number; email: string }>(endpoints.users.byId(id)),
};

export const postsApi = {
  list: (page?: number, pageSize?: number) => {
    const { path, searchParams } = endpoints.posts.list(page, pageSize);
    return http.get<{
      items: Array<{ id: number; title: string }>;
      total: number;
    }>(path, { searchParams });
  },
  create: (payload: { title: string; body: string }) =>
    http.post<{ id: number }>(endpoints.posts.create(), payload),
};
