type AccessToken = string | null;
type Listener = () => void;

class TokenStore {
  private token: AccessToken = null;
  private listeners = new Set<Listener>();

  private emit() {
    for (const listener of this.listeners) listener();
  }

  getSnapshot = () => this.token;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  set(token: AccessToken) {
    this.token = token;
    this.emit();
  }

  clear() {
    this.set(null);
  }
}

export const tokenStore = new TokenStore();
