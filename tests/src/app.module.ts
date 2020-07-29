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
        })
    ],
    controllers: [AppController],
    providers: [AppService],
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