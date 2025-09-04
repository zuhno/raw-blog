type Listener = () => void;

abstract class BaseStore<T> {
  private listeners = new Set<Listener>();

  protected emit() {
    for (const listener of this.listeners) listener();
  }

  abstract getSnapshot(): T;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

export default BaseStore;
