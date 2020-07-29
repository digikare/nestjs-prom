import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Summary } from 'prom-client';
import { PromService } from './prom.service';

@Injectable()
export class PromInterceptor implements NestInterceptor {

    private readonly _summary: Summary<string>;

    constructor(
        private readonly _service: PromService,
    ) {
        this._summary = this._service.getSummary({
            name: 'http_requests',
            help: 'http_requests Http requests stats',
            labelNames: ['method', 'path', 'statusCode']
        });
    }
    intercept(
        context: ExecutionContext, 
        next: CallHandler,
    ): Observable<any> {

        const ctx = context.switchToHttp();
        const req = ctx.getRequest();
        const url = req.url;

        // ignore favicon
        if (url == '/favicon.ico') {
            return next.handle();
        }

        // ignore metrics itself
        // TODO: need improvment to check correctly our current controller
        if (url.match(/\/metrics(\?.*?)?$/)) {
            return next.handle();
        }

        const end = this._summary.startTimer({
            method: req.method,
            path: req.url,
        });

        const now = Date.now();
        return next
            .handle()
            .pipe(
                finalize(() => {
                    const res = ctx.getResponse();
                    end({ statusCode: res.statusCode });
                }),
            );
    }
}
