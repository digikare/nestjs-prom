
export interface PromModuleOptions {
  [key: string]: any;

  withDefaultsMetrics?: boolean;
  withDefaultController?: boolean;
  useHttpCounterMiddleware?: boolean;

  registryName?: string;
  timeout?: number;
  prefix?: string;
  defaultLabels?: {
    [key: string]: any,
  };
}