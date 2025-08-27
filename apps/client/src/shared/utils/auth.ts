import { tokenStore } from "../../states/token";

type ResolveFn = () => void;
type RejectFn = (e: unknown) => void;

class AuthManager {
  private inFlight: Promise<void> | null = null;
  private waiters: Array<{ resolve: ResolveFn; reject: RejectFn }> = [];

  async waitIfRefreshing() {
    if (!this.inFlight) return;
    await this.inFlight.catch(() => {});
  }

  async ensureRefreshed(doRefresh: () => Promise<string>) {
    if (!this.inFlight) {
      this.inFlight = (async () => {
        try {
          const newToken = await doRefresh();
          tokenStore.set(newToken);
          this.resolveAll();
        } catch (e) {
          tokenStore.clear();
          this.rejectAll(e);
          throw e;
        } finally {
          this.inFlight = null;
        }
      })();
    }
    return this.inFlight;
  }

  async waitForRefreshDone() {
    if (!this.inFlight) return;
    await this.inFlight;
  }

  enqueue(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.waiters.push({ resolve, reject });
    });
  }
  private resolveAll() {
    const list = [...this.waiters];
    this.waiters = [];
    list.forEach((w) => w.resolve());
  }
  private rejectAll(e: unknown) {
    const list = [...this.waiters];
    this.waiters = [];
    list.forEach((w) => w.reject(e));
  }
}
export const authManager = new AuthManager();
