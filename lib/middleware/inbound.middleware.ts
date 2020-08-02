import { Injectable, NestMiddleware } from "@nestjs/common";
import { Counter, Histogram } from "prom-client";
import * as responseTime from "response-time";
import { InjectCounterMetric, InjectHistogramMetric } from "../common";

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  constructor(
    @InjectCounterMetric('http_requests_total') private readonly _requestsTotal: Counter<string>,
    @InjectHistogramMetric('http_requests_duration_seconds') private readonly _requestsDuration: Histogram<string>,
  ) {}

  use (req, res, next) {
    responseTime((req, res, time) => {
      const { url, method } = req;
      const path = url;

      if (path.match(/\/metrics(\?.*?)?$/) === null && path !== "/favicon.ico") {
        const status = res.statusCode;
        const labels = { method, status, path };

        this._requestsTotal.inc(labels);
        this._requestsDuration.observe(labels, time / 1000);
      }
    })(req, res, next);
  }
}
