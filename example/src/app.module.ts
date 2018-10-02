import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromModule, MetricType } from '../../lib';

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'v1.0.0',
      },
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
export class AppModule {}
