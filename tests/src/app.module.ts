import { NestModule, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { PromModule, InboundMiddleware } from '../../lib';
import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
    imports: [
        PromModule.forRoot({
            defaultLabels: {
                app: 'v1.0.0',
            },
            useHttpCounterMiddleware: true,
            withGlobalInterceptor: true,
            labelsProvider: 'PROM_LABEL_TEST'
        })
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: 'PROM_LABEL_TEST',
            useValue: {
                toto: 'true',
                tata: 1,
            },
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(InboundMiddleware)
            .exclude({
                path: '/metrics',
                method: RequestMethod.GET,
            })
            .forRoutes('*');
    }
}