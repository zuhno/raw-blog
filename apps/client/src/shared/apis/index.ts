import auth from "./auth";
import comments from "./comments";
import contents from "./contents";
import tags from "./tags";
import users from "./users";

const endpoints = {
  auth,
  contents,
  comments,
  tags,
  users,
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
  getSearchByName: (name: string) => {
    const { request, path } = endpoints.tags.searchByName(name);
    return request(path);
  },
};

export const usersApi = {
  getMe: () => {
    const { request, path } = endpoints.users.me();
    return request(path);
  },
};
