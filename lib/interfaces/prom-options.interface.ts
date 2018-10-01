
export interface PromModuleOptions {
  [key: string]: any;

  registryName?: string;
  timeout?: number;
  prefix?: string;
  defaultLabels?: {
    [key: string]: any,
  };
}