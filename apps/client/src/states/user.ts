import BaseStore from "./base";
import type { Nullable } from "../shared/utils/type";

export type TUser = Nullable<{
  id: number;
  email: string;
  nickname: string;
  avatarUrl: string;
}>;

class UserStore extends BaseStore<TUser> {
  private user: TUser = null;

  getSnapshot = () => this.user;

  set(user: TUser) {
    this.user = user;
    super.emit();
  }

  clear() {
    this.set(null);
  }
}

export const userStore = new UserStore();
