import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from '@nestjs/core';
import { PromService } from "./prom.service";
import { Counter } from "prom-client";

@Catch()
export class PromCatchAllExceptionsFilter extends BaseExceptionFilter {

    private _counter: Counter<string>;

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
            path: request.baseUrl ?? request.url,
            status,
        });
        super.catch(exception, host);
    }
}