import { http } from "../configs/api";

export default {
  create: (data: {
    title: string;
    body: string;
    type: string;
    publish: boolean;
    private: boolean;
    tags: string[];
  }) => ({
    request: http.post,
    path: "/contents",
    body: data,
  }),
  list: (query: {
    type: string;
    tagIds: string[];
    offset: number;
    limit: number;
    sort: number;
  }) => ({
    request: http.get,
    path: "/contents",
    searchParams: new URLSearchParams(
      query as unknown as Record<string, string>
    ).toString(),
  }),
  detail: (id: number) => ({ request: http.get, path: `/contents/${id}` }),
  update: (
    id: number,
    data: {
      title?: string;
      body?: string;
      type?: string;
      publish?: boolean;
      private?: boolean;
      tags?: string[];
    }
  ) => ({ request: http.patch, path: `/contents/${id}`, body: data }),
};
