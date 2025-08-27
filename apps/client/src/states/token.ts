type AccessToken = string | null;

class TokenStore {
  private accessToken: AccessToken = null;

  get() {
    return this.accessToken;
  }
  set(token: string) {
    this.accessToken = token;
    // 필요하다면 localStorage 연동:
    // localStorage.setItem("access_token", token);
  }
  clear() {
    this.accessToken = null;
    // localStorage.removeItem("access_token");
  }
}
export const tokenStore = new TokenStore();
