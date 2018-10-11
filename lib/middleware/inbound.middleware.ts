import { Injectable, NestMiddleware, MiddlewareFunction, OnModuleInit } from "@nestjs/common";
import { Counter } from "prom-client";
import { InjectCounterMetric, getMetricToken } from "../common";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  constructor(
    @InjectCounterMetric('http_requests_total') private readonly _counter: Counter,
  ) {}

  resolve(): MiddlewareFunction {
    return (req, res, next) => {

      const url = req.baseUrl;
      const method = req.method;

      // ignore favicon
      if (url == '/favicon.ico') {
        next();
        return ;
      }

      // ignore metrics itself
      // TODO: need improvment to check correctly our current controller
      if (url.match(/\/metrics(\?.*?)?$/)) {
        next();
        return ;
      }

      this._counter.labels(method).inc(1, new Date());

      next();
    }
  }
}
