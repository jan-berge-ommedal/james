export type Listener<DATA> = (data: DATA) => void

export interface Observable<DATA> {
    on: (listener: Listener<DATA>) => void;
    publish: (data: DATA) => void;
}

export function createObservable<DATA>(): Observable<DATA> {
  const listeners: Listener<DATA>[] = [];
  return {
    publish(data: DATA): void {
      listeners.forEach((listener) => listener(data));
    },
    on: (listener) => {
      listeners.push(listener);
    },
  };
}
