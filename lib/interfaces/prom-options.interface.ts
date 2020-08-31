import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface PromModuleCoreOptions {
  customRegistry?: boolean;
  prefix?: string;

  /**
   * Set the defaults labels
   */
  defaultLabels?: {
    [key: string]: string | number,
  };
}

export interface PromModuleOptions {

  /**
   * Enable default metrics
   * Under the hood, that call collectDefaultMetrics()
   */
  withDefaultsMetrics?: boolean;

  /**
   * Enable internal controller to expose /metrics
   * Caution: If you have a global prefix, don't forget to prefix it in prom
   */
  withDefaultController?: boolean;

  /**
   * Create automatically http_requests_total counter
   */
  useHttpCounterMiddleware?: boolean;

  /**
   * Catch exception?
   */
  withExceptionFilter?: boolean;

  /**
   * Eanble or not the global interceptor
   * Usefull to catch exception thrown by your app
   */
  withGlobalInterceptor?: boolean;

  customRegistry?: boolean;
  prefix?: string;

  /**
   * Set the defaults labels
   */
  defaultLabels?: {
    [key: string]: string|number,
  };

  customUrl?: string;
}

export interface PromModuleAsyncOptionsFactory {
  createPromOptions(): Promise<PromModuleCoreOptions> | PromModuleCoreOptions;
}

export interface PromModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<PromModuleAsyncOptionsFactory>;
  useClass?: Type<PromModuleAsyncOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PromModuleCoreOptions> | PromModuleCoreOptions;
  inject?: any[];
}
