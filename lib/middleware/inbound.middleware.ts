import { Injectable, NestMiddleware, MiddlewareFunction, OnModuleInit } from "@nestjs/common";
import { Counter } from "prom-client";
import { InjectCounterMetric, getMetricToken } from "../common";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  constructor(
    @InjectCounterMetric('http_requests_in') private readonly _counter: Counter,
  ) {}

  // onModuleInit() {
    // console.log(`InboundMiddleware::onModuleInit()`);
    // this._counter = this._moduleRef.get(getMetricToken(`Counter`, `http_requests_in`))
  // }

  resolve(): MiddlewareFunction {
    return (req: Request, res, next) => {
      console.log(`InboundMiddleware::resolve()`);
      if (this._counter) {
        this._counter.labels(req.method).inc(1, new Date());
      }
      next();
    }
  }

}
