export type BusHandler = (payload: unknown) => void;

export type Bus = {
  on(type: string, handler: BusHandler): () => void;
  emit(type: string, payload?: unknown): void;
};

export function createBus(): Bus {
  const listeners = new Map<string, Set<BusHandler>>();
  return {
    on(type, handler) {
      let set = listeners.get(type);
      if (!set) {
        set = new Set();
        listeners.set(type, set);
      }
      set.add(handler);
      return () => {
        set.delete(handler);
      };
    },
    emit(type, payload) {
      const set = listeners.get(type);
      if (!set) return;
      for (const handler of set) handler(payload);
    },
  };
}

export const bus = createBus();
