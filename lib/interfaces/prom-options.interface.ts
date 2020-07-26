
export interface PromModuleOptions {
  [key: string]: any;

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

  withGlobalInterceptor?: boolean;

  registryName?: string;
  prefix?: string;
  defaultLabels?: {
    [key: string]: any,
  };

  customUrl?: string;
}
