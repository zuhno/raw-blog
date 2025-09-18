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
interface IDetailResp extends IContent {}
interface IUpdateResp extends IContent {}

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
    path: "contents",
    body: data,
  }),
  verify: (id: number) => ({
    request: http.get,
    path: `contents/${id}/verify`,
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
    path: "contents",
    searchParams: new URLSearchParams(
      query as unknown as Record<string, string>
    ).toString(),
  }),
  detail: (id: number) => ({
    request: http.get<IDetailResp>,
    path: `contents/${id}`,
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
    path: `contents/${id}`,
    body: data,
  }),
};
