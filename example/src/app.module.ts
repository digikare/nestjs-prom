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
      requestsMetricsOptions: {
        timeBuckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10]
      }
    }),
    PromModule.forMetrics([
      {
        type: MetricType.Counter,
        configuration: {
          name: 'index_counter',
          help: 'index_counter a simple counter',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InboundMiddleware)
      .forRoutes('*');
  }
}
