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
   * Middleware http
   *
   * Set enable = true to create automatically http_requests_total counter and http_requests_duration_seconds histogram
   */
  withHttpMiddleware?: {

    /**
     * Enable the middleware http
     *
     * @type {boolean}
     * @default false
     */
    enable?: boolean;

    /**
     * Buckets for requests duration seconds histogram
     *
     * @default '[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10]'
     */
    timeBuckets?: Array<number>;

    /**
     * Additional masks for requests paths normalization
     */
    pathNormalizationExtraMasks?: Array<RegExp>;
  };

  registryName?: string;
  prefix?: string;

  /**
   * Set the defaults labels
   */
  defaultLabels?: {
    [key: string]: string|number,
  };

  /**
   * @deprecated Please use metricPath
   * @see metricPath
   */
  customUrl?: string;

  /**
   * The metric path to use
   *
   * @default /metrics
   */
  metricPath?: string;

  /**
   * Pushgateway address
   * 
   */
  pushgateway?: string;
}
