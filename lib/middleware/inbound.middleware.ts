import { Injectable, NestMiddleware } from "@nestjs/common";
import { PromService } from '../prom.service';
import { Counter } from 'prom-client';

@Injectable()
export class InboundMiddleware implements NestMiddleware {

  private readonly _counter: Counter<string>;

  constructor(
    private readonly _service: PromService,
  ) {
    this._counter = this._service.getCounter({
      name: 'http_requests_total',
      help: 'http_requests_total Number of inbound request',
      labelNames: ['method', 'status', 'path']
    });
  }

  use (req, res, next) {

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

    const labelValues = {
      method,
      status: res.statusCode,
      path: url,
    };

    this._counter.inc(labelValues, 1);

    next();
  }
}
