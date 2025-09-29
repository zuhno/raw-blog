import analysis from "./analysis";
import auth from "./auth";
import comments from "./comments";
import contents from "./contents";
import files from "./files";
import tags from "./tags";
import users from "./users";
import visitors from "./visitors";

const endpoints = {
  auth,
  contents,
  comments,
  tags,
  users,
  files,
  visitors,
  analysis,
};

export const authApi = {
  postExchangeGoogleCode: (code: string) => {
    const { request, path, body, headers } =
      endpoints.auth.exchangeGoogleCode(code);
    return request(path, body, { headers });
  },
  postTokenRefresh: () => {
    const { request, path } = endpoints.auth.tokenRefresh();
    return request(path);
  },
  postSignout: () => {
    const { request, path } = endpoints.auth.signout();
    return request(path);
  },
};

export const contentsApi = {
  getVerify: (id: number) => {
    const { request, path } = endpoints.contents.verify(id);
    return request(path);
  },
  getList: (query: Parameters<typeof endpoints.contents.list>[0]) => {
    const { request, path, searchParams } = endpoints.contents.list(query);
    return request(path, { searchParams });
  },
  getDetail: (id: number) => {
    const { request, path } = endpoints.contents.detail(id);
    return request(path);
  },
  postCreate: (data: Parameters<typeof endpoints.contents.create>[0]) => {
    const { request, path, body } = endpoints.contents.create(data);
    return request(path, body);
  },
  patchUpdate: (
    id: Parameters<typeof endpoints.contents.update>[0],
    data: Parameters<typeof endpoints.contents.update>[1]
  ) => {
    const { request, path, body } = endpoints.contents.update(id, data);
    return request(path, body);
  },
};

export const commentsApi = {
  getList: (id: number) => {
    const { request, path } = endpoints.comments.list(id);
    return request(path);
  },
  postCreate: (data: Parameters<typeof endpoints.comments.create>[0]) => {
    const { request, path, body } = endpoints.comments.create(data);
    return request(path, body);
  },
  patchUpdate: (
    id: Parameters<typeof endpoints.comments.update>[0],
    data: Parameters<typeof endpoints.comments.update>[1]
  ) => {
    const { request, path, body } = endpoints.comments.update(id, data);
    return request(path, body);
  },
  deleteRemove: (id: number) => {
    const { request, path } = endpoints.comments.remove(id);
    return request(path);
  },
};

export const tagsApi = {
  getListWithCount: () => {
    const { request, path } = endpoints.tags.listWithCount();
    return request(path);
  },
  getSearchByName: (name: string) => {
    const { request, path } = endpoints.tags.searchByName(name);
    return request(path);
  },
  getSearchById: (id: number) => {
    const { request, path } = endpoints.tags.searchById(id);
    return request(path);
  },
};

export const usersApi = {
  getMe: () => {
    const { request, path } = endpoints.users.me();
    return request(path);
  },
};

export const filesApi = {
  postUploadImg: (file: File) => {
    const { request, path, body } = endpoints.files.uploadImage(file);
    return request(path, body);
  },
};

export const visitorsApi = {
  postLog: () => {
    const { request, path } = endpoints.visitors.log();
    return request(path);
  },
};

export const analysisApi = {
  getVisitorStats: (
    query: Parameters<typeof endpoints.analysis.visitorStats>[0]
  ) => {
    const { request, path, searchParams } =
      endpoints.analysis.visitorStats(query);
    return request(path, { searchParams });
  },
};
