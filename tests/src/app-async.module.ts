import { NestModule, Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PromModule, InboundMiddleware } from '../../lib';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  providers: [
    {
      provide: 'APP_LABELS_TOKEN',
      useFactory: async () => {
        return {
          app: 'v1.0.0',
          toto: 'true',
          tata: 1,
        };
      }
    },
  ],
  exports: ['APP_LABELS_TOKEN']
})
export class ConfigModule {}

@Module({
  imports: [
    ConfigModule,
    PromModule.forRootAsync({
      imports: [ConfigModule],
      inject: ['APP_LABELS_TOKEN'],
      useFactory: async (labels: {[key: string]: any}) => {
        return {
          defaultLabels: labels,
        };
      },
    }, {
      withGlobalInterceptor: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppAsyncModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InboundMiddleware)
      .exclude({
        path: '/metrics',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
