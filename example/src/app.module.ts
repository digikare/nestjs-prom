import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromModule, MetricType, PromController } from '../../lib';
import { InboundMiddleware } from '../../lib/middleware/inbound.middleware';

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'v1.0.0',
      },
      useHttpCounterMiddleware: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InboundMiddleware)
      .exclude({
        path: '/metrics',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
