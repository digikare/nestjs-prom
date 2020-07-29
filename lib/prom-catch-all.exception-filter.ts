import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from '@nestjs/core';
import { PromService } from "./prom.service";
import { CounterMetric } from "./interfaces";

function getBaseUrl(url?: string) {
    if (!url) {
        return url;
    }

    if (url.indexOf('?') === -1) {
        return url;
    } 
    return url.split('?')[0];
}

@Catch()
export class PromCatchAllExceptionsFilter extends BaseExceptionFilter {

    private _counter: CounterMetric;

    constructor(
        promService: PromService,
    ) {

        super();

        this._counter = promService.getCounter({
            name: 'http_exceptions',
            labelNames: ['method', 'path', 'status'],
        });
    }

    catch(
        exception: unknown, 
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        this._counter.inc({
            method: request.method,
            path: getBaseUrl(request.baseUrl || request.url),
            status,
        });
        super.catch(exception, host);
    }
}