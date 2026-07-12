declare module 'next' {
  export type Metadata = Record<string, unknown>;
}

declare module '*.css';

declare namespace React {
  type ReactNode = unknown;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}


declare module 'next/server' {
  export const NextResponse: {
    json: (body: unknown, init?: { status?: number }) => Response;
  };
}

declare const process: {
  env: Record<string, string | undefined>;
};
