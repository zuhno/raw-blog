import { http } from "../configs/api";

interface IContent {
  id: number;
  authorId: number;
  title: string;
  body: string;
  publish: boolean;
  private: boolean;
  type: "DAILY" | "POST";
  tags: {
    id: number;
    name: string;
  }[];
  createdAt: string;
}

interface ICreateResp extends IContent {}
interface IListResp {
  contents: IContent[];
  lastOffset: number;
  hasNext: boolean;
}
interface IDetailResp extends IContent {
  views: number;
}
interface IUpdateResp extends IContent {}

const prefix = "contents";

export default {
  create: (data: {
    title: string;
    body: string;
    type: string;
    publish: boolean;
    private: boolean;
    tags?: string[];
  }) => ({
    request: http.post<ICreateResp>,
    path: `${prefix}`,
    body: data,
  }),
  verify: (id: number) => ({
    request: http.get,
    path: `${prefix}/${id}/verify`,
  }),
  list: (query: {
    type?: "POST" | "DAILY";
    limit?: number;
    offset?: number;
    tagIds?: string[];
    sort?: number;
    all?: number;
  }) => ({
    request: http.get<IListResp>,
    path: `${prefix}`,
    searchParams: new URLSearchParams(
      query as unknown as Record<string, string>
    ).toString(),
  }),
  detail: (id: number) => ({
    request: http.get<IDetailResp>,
    path: `${prefix}/${id}`,
  }),
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
  ) => ({
    request: http.patch<IUpdateResp>,
    path: `${prefix}/${id}`,
    body: data,
  }),
};
