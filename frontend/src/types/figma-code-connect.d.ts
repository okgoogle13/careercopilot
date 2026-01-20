declare module '@figma/code-connect' {
  export type FigmaPropSchema = Record<string, unknown>;

  export interface FigmaApi {
    connect: (
      component: unknown,
      url: string,
      config: {
        props: FigmaPropSchema;
        example: (props: any) => JSX.Element;
      }
    ) => void;
    enum: <T extends string>(name: string, options: Record<string, T>) => T;
    string: (name: string) => string;
    boolean: (name: string) => boolean;
    children: (name: string) => React.ReactNode;
  }

  const figma: FigmaApi;
  export default figma;
}
