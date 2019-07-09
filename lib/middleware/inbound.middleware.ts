import { Injectable, NestMiddleware } from "@nestjs/common";
import { Counter } from "prom-client";
import { InjectCounterMetric } from "../common";

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  constructor(
    @InjectCounterMetric('http_requests_total') private readonly _counter: Counter,
  ) { }

  use(req: Request, res: Response, next: Function) {
    const url = req.url;
    const method = req.method;

    // ignore favicon
    if (url == '/favicon.ico') {
      next();
      return;
    }

    // ignore metrics itself
    // TODO: need improvment to check correctly our current controller
    if (url.match(/\/metrics(\?.*?)?$/)) {
      next();
      return;
    }

    this._counter.labels(method).inc(1, new Date());

    next();
  }
}
