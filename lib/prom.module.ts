import { Module, DynamicModule } from '@nestjs/common';
import { PromCoreModule } from './prom-core.module';
import { PromModuleOptions, MetricType, MetricTypeConfigurationInterface } from './interfaces';
import { createPromCounterProvider, createPromGaugeProvider, createPromHistogramProvider, createPromSummaryProvider } from './prom.providers';
import * as client from 'prom-client';
import { PromController } from './prom.controller';
import { PromService } from './prom.service';

@Module({})
export class PromModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      withDefaultController,
      useHttpCounterMiddleware,
      ...promOptions
    } = options;

    const moduleForRoot: DynamicModule = {
      module: PromModule,
      imports: [PromCoreModule.forRoot(options)],
      controllers: [],
      exports: [
        PromService,
      ],
      providers: [
        PromService,
      ],
    };

    // default push default controller
    if (withDefaultController !== false) {
      moduleForRoot.controllers = [...moduleForRoot.controllers, PromController.forRoot(options.customUrl || 'metrics')];
    }

    // if want to use the http counter
    if (useHttpCounterMiddleware) {
      const inboundProvider = createPromCounterProvider({
        name: 'http_requests_total',
        help: 'http_requests_total Number of inbound request',
        labelNames: ['method', 'status', 'path']
      });

      moduleForRoot.providers = [...moduleForRoot.providers , inboundProvider];
      moduleForRoot.exports = [...moduleForRoot.exports, inboundProvider];
    }

    return moduleForRoot;
  }

  static forMetrics(
    metrics: MetricTypeConfigurationInterface[],
  ): DynamicModule {

    const providers = metrics.map((entry) => {
      switch (entry.type) {
        case MetricType.Counter:
          return createPromCounterProvider(entry.configuration);
        case MetricType.Gauge:
          return createPromGaugeProvider(entry.configuration);
        case MetricType.Histogram:
          return createPromHistogramProvider(entry.configuration);
        case MetricType.Summary:
          return createPromSummaryProvider(entry.configuration);
        default:
          throw new ReferenceError(`The type ${entry.type} is not supported`);
      }
    });

    return {
      module: PromModule,
      providers: providers,
      exports: providers,
    };
  }

  static forCounter(
    configuration: client.CounterConfiguration<string>,
  ): DynamicModule {
    const provider = createPromCounterProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forGauge(
    configuration: client.GaugeConfiguration<string>,
  ): DynamicModule {
    const provider = createPromGaugeProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forHistogram(
    configuration: client.HistogramConfiguration<string>
  ): DynamicModule {
    const provider = createPromHistogramProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forSummary(
    configuration: client.SummaryConfiguration<string>
  ): DynamicModule {
    const provider = createPromSummaryProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
