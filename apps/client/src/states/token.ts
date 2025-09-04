import BaseStore from "./base";
import type { Nullable } from "../shared/utils/type";

export type TAccessToken = Nullable<string>;

class TokenStore extends BaseStore<TAccessToken> {
  private token: TAccessToken = null;

  getSnapshot = () => this.token;

  set(token: TAccessToken) {
    this.token = token;
    super.emit();
  }

  clear() {
    this.set(null);
  }
}

export const tokenStore = new TokenStore();
