import { Module, DynamicModule } from '@nestjs/common';
import { PromCoreModule } from './prom-core.module';
import { PromModuleOptions } from './interfaces';
import { createPromCounterProvider } from './prom.providers';
import * as client from 'prom-client';

@Module({})
export class PromModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {
    return {
      module: PromModule,
      imports: [PromCoreModule.forRoot(options)]
    }
  }

  static forCounter(
    configuration: client.CounterConfiguration,
  ): DynamicModule {
    const provider = createPromCounterProvider(configuration);
    return {
      module: PromModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forGauge(
    name: string,
    help: string,
    labels?: string[],
  ): DynamicModule {
    const providers = [];
    return {
      module: PromModule,
      providers: providers,
      exports: providers,
    };
  }

  static forHistogram(
    name: string,
    help: string,
    buckets: number[],
    labels?: string[],
  ): DynamicModule {
    const providers = [];
    return {
      module: PromModule,
      providers: providers,
      exports: providers,
    };
  }

  static forSummary(
    name: string,
    help: string,
    buckets?: number[],
    labels?: string[],
  ): DynamicModule {
    const providers = [];
    return {
      module: PromModule,
      providers: providers,
      exports: providers,
    };
  }
}
