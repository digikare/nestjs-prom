
export interface PromModuleOptions {
  [key: string]: any;

  withDefaultsMetrics?: boolean;
  registryName?: string;
  timeout?: number;
  prefix?: string;
  defaultLabels?: {
    [key: string]: any,
  };
}