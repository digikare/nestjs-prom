import { Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { BaseExceptionFilter } from '@nestjs/core';
import { CounterMetric, PromModuleOptions } from "./interfaces";
import { normalizePath } from './utils';
import { PromCounter } from './common';
import { DEFAULT_PROM_OPTIONS } from './prom.constants';
import { PromService } from './prom.service';

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

    private readonly _counter: CounterMetric;

    constructor(
        promService: PromService,
    ) {
        super();

        this._counter = promService.getCounter({
            name: 'http_exceptions',
            labelNames: ['method', 'status', 'path'],
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

        const path = normalizePath(getBaseUrl(request.baseUrl || request.url), [], "#val");

        this._counter.inc({
            method: request.method,
            path,
            status,
        });
        super.catch(exception, host);
    }
}