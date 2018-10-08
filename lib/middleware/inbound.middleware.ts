import { Injectable, NestMiddleware, MiddlewareFunction, OnModuleInit } from "@nestjs/common";
import { Counter } from "prom-client";
import { InjectCounterMetric, getMetricToken } from "../common";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  constructor(
    @InjectCounterMetric('http_requests') private readonly _counter: Counter,
  ) {}

  resolve(): MiddlewareFunction {
    return (req, res, next) => {

      const url = req.baseUrl;
      const method = req.method;

      // process the request
      next();

      // ignore favicon
      if (url == '/favicon.ico') {
        return ;
      }

      // ignore metrics itself
      // TODO: need improvment to check correctly our current controller
      if (url.match(/\/metrics(\?.*?)?$/)) {
        return ;
      }

      // update counter
      this._counter.labels(method, res.statusCode.toString() || "500").inc(1, new Date());

    }
  }
}
