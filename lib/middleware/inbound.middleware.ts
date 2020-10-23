import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { PromService } from '../prom.service';
import { Histogram } from 'prom-client';
import * as responseTime from "response-time";
import { DEFAULT_PROM_OPTIONS } from '../prom.constants';
import { PromModuleOptions } from '../interfaces';
import { normalizePath, normalizeStatusCode } from '../utils';

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  private readonly _histogram: Histogram<string>;
  private readonly defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10];

  constructor(
    @Inject(DEFAULT_PROM_OPTIONS) private readonly _options: PromModuleOptions,
    private readonly _service: PromService,
  ) {
    const buckets: number[] = this._options.withHttpMiddleware?.timeBuckets ?? [];
    this._histogram = this._service.getHistogram({
      name: 'http_requests',
      help: 'HTTP requests - Duration in seconds',
      labelNames: ['method', 'status', 'path'],
      buckets: buckets.length > 0 ? buckets : this.defaultBuckets,
    });
  }

  use (req, res, next) {
    responseTime((req, res, time) => {
      const { url, method } = req;
      const path = normalizePath(url, this._options.withHttpMiddleware?.pathNormalizationExtraMasks, "#val");
      if (path === "/favicon.ico") {
        return ;
      }
      if (path === this._options.customUrl || path === this._options.metricPath) {
        return ;
      }

      const status = normalizeStatusCode(res.statusCode);
      const labels = { method, status, path };

      this._histogram.observe(labels, time / 1000);
    })(req, res, next);
  }
}
