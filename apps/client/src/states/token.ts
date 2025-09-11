import BaseStore from "./base";
import type { Nullable } from "../shared/utils/type";

export type TAccessToken = Nullable<string>;

const KEY_NAME = "AT";

class TokenStore extends BaseStore<TAccessToken> {
  getSnapshot = () => localStorage.getItem(KEY_NAME);

  set(token: TAccessToken) {
    if (token) localStorage.setItem(KEY_NAME, token);
    else localStorage.removeItem(KEY_NAME);
    super.emit();
  }

  clear() {
    this.set(null);
  }
}

export const tokenStore = new TokenStore();
