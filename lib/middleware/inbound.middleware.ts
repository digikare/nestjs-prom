import { Injectable, NestMiddleware, MiddlewareFunction, OnModuleInit } from "@nestjs/common";
import { Counter } from "prom-client";
import { InjectCounterMetric, getMetricToken } from "../common";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  constructor(
    @InjectCounterMetric('http_requests_in') private readonly _counter: Counter,
  ) {}

  resolve(): MiddlewareFunction {
    return (req, res, next) => {
      // ignore favicon
      if (req.baseUrl == '/favicon.ico') {
        next();
        return ;
      }

      // ignore metrics itself
      // TODO: need improvment to check correctly our current controller
      if (req.baseUrl.match(/\/metrics(\?.*?)?$/)) {
        next();
        return ;
      }

      if (this._counter) {
        this._counter.labels(req.method).inc(1, new Date());
      }
      next();
    }
  }

}
