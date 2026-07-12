declare module '*.css';

declare module 'react' {
  export type FormEvent<T = Element> = { preventDefault(): void; currentTarget: T };
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useState<T>(initial: T): [T, (value: T | ((current: T) => T)) => void];
}

declare module 'next' {
  export type Metadata = Record<string, unknown>;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}

declare namespace React {
  type ReactNode = unknown;
}

type PagesFunction<Env = unknown> = (context: { env: Env; request: Request }) => Response | Promise<Response>;

type D1Database = {
  prepare(query: string): D1PreparedStatement;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
};

type R2Bucket = {
  put(key: string, value: ReadableStream, options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }): Promise<unknown>;
};
