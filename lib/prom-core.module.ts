import {
  Global,
  DynamicModule,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { PromModuleOptions, PromModuleAsyncOptions, PromLabels, PromModuleAsyncOptionsFactory } from './interfaces';
import { DEFAULT_PROM_REGISTRY, PROM_OPTIONS } from './prom.constants';
import * as client from 'prom-client';
import { Registry, collectDefaultMetrics, DefaultMetricsCollectorConfiguration } from 'prom-client';

@Global()
@Module({})
export class PromCoreModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const promRegistryOptionsProvider = {
      provide: PROM_OPTIONS,
      useValue: options,
    }

    const registryProvider: Provider = {
      provide: DEFAULT_PROM_REGISTRY,
      inject: [PROM_OPTIONS],
      useFactory: (options: PromModuleOptions) =>
        PromCoreModule.createRegistryFactory(options),
    }

    return {
      module: PromCoreModule,
      providers: [
        promRegistryOptionsProvider,
        registryProvider,
      ],
      exports: [
        registryProvider,
      ],
    };
  }

  static forRootAsync(
    options: PromModuleAsyncOptions = {},
  ): DynamicModule {

    const registryProvider: Provider = {
      provide: DEFAULT_PROM_REGISTRY,
      inject: [PROM_OPTIONS],
      useFactory: (options: PromModuleOptions) =>
        PromCoreModule.createRegistryFactory(options),
    }

    return {
      module: PromCoreModule,
      imports: [
        ...options.imports ?? [],
      ],
      providers: [
        ...this.createAsyncProviders(options),
        registryProvider,
      ],
      exports: [
        registryProvider,
      ]
    };

  }

  private static createAsyncProviders(
    options: PromModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PromModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PROM_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<PromModuleAsyncOptions>,
    ];
    return {
      provide: PROM_OPTIONS,
      useFactory: async (optionsFactory: PromModuleAsyncOptionsFactory) =>
        await optionsFactory.createPromOptions(),
      inject,
    };
  }

  private static async createRegistryFactory(
    options: PromModuleOptions,
  ): Promise<Registry> {
    let registry = client.register;

    if (options.customRegistry === true) {
      registry = new Registry();
    }

    registry.clear();

    const defaultLabels: PromLabels = {
      ...(options.defaultLabels ?? {}),
    };
    registry.setDefaultLabels(defaultLabels);

    if (options.withDefaultsMetrics !== false) {
      const defaultMetricsOptions: DefaultMetricsCollectorConfiguration = {
        register: registry,
      };
      if (options.prefix) {
        defaultMetricsOptions.prefix = options.prefix;
      }
      collectDefaultMetrics(defaultMetricsOptions);
    }

    return registry;
  }
}
