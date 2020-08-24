import {
  Global,
  DynamicModule,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { PromModuleOptions, PromModuleAsyncOptions, PromLabels } from './interfaces';
import { DEFAULT_PROM_REGISTRY, PROM_REGISTRY_NAME, PROM_OPTIONS, PROM_LABELS } from './prom.constants';

import * as client from 'prom-client';
import { Registry, collectDefaultMetrics, DefaultMetricsCollectorConfiguration } from 'prom-client';
import { getRegistryName } from './common/prom.utils';

@Global()
@Module({})
export class PromCoreModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      registryName,
      prefix,
    } = options;

    const promRegistryName = registryName ?
      getRegistryName(registryName)
      : DEFAULT_PROM_REGISTRY;

    const promRegistryNameProvider = {
      provide: PROM_REGISTRY_NAME,
      useValue: promRegistryName,
    }

    const promRegistryOptionsProvider = {
      provide: PROM_OPTIONS,
      useValue: options,
    }

    const registryProvider: Provider = {
      provide: promRegistryName,
      inject: [PROM_OPTIONS],
      useFactory: (
        opts: PromModuleOptions
      ): Registry => {

        let registry = client.register;
        if (promRegistryName !== DEFAULT_PROM_REGISTRY) {
          registry = new Registry();
        }

        // clear here for HMR support
        registry.clear();
        
        const defaultLabels: PromLabels = {
          ...(opts.defaultLabels ?? {}),
        };
        registry.setDefaultLabels(defaultLabels);
        
        if (opts.withDefaultsMetrics !== false) {
          const defaultMetricsOptions: DefaultMetricsCollectorConfiguration = {
            register: registry,
          };
          if (prefix) {
            defaultMetricsOptions.prefix = prefix;
          }
          collectDefaultMetrics(defaultMetricsOptions);
        }

        return registry;
      },
    }

    return {
      module: PromCoreModule,
      providers: [
        promRegistryNameProvider,
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

    const {
      registryName,
      prefix,
    } = options;

    const promRegistryName = registryName ?
      getRegistryName(registryName)
      : DEFAULT_PROM_REGISTRY;

    const promRegistryNameProvider = {
      provide: PROM_REGISTRY_NAME,
      useValue: promRegistryName,
    }

    const promRegistryOptionsProvider = {
      provide: PROM_OPTIONS,
      useValue: options,
    }

    const registryProvider: Provider = {
      provide: promRegistryName,
      useFactory: (
        
      ): Registry => {

        let registry = client.register;
        if (promRegistryName !== DEFAULT_PROM_REGISTRY) {
          registry = new Registry();
        }

        // clear here for HMR support
        registry.clear();

        // registry.setDefaultLabels(defaultLabels);

        if (withDefaultsMetrics !== false) {
          const defaultMetricsOptions: DefaultMetricsCollectorConfiguration = {
            register: registry,
          };
          if (prefix) {
            defaultMetricsOptions.prefix = prefix;
          }
          collectDefaultMetrics(defaultMetricsOptions);
        }

        return registry;
      },
    }

    providers.push(
      promRegistryNameProvider,
      promRegistryOptionsProvider,
      registryProvider,
    );

    return {
      module: PromCoreModule,
      imports: options.imports,
      providers: [],
      exports: [
        registryProvider,
      ],
    };

  }

  private static createAsyncProviders(
    options: PromModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<PromModuleOptions>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
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
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<PromModuleAsyncOptions>,
    ];
    return {
      provide: PROM_OPTIONS,
      useFactory: async (optionsFactory: PromModuleAsyncOptions) =>
        await optionsFactory.createTypeOrmOptions(options.name),
      inject,
    };
  }

  private static async createRegistryFactory(): Promise<Registry> {
    let registry = client.register;

    // TODO: support custom registry here
    // if (promRegistryName !== DEFAULT_PROM_REGISTRY) {
    //   registry = new Registry();
    // }

    registry.clear();

    registry.setDefaultLabels({});

    // if (withDefaultsMetrics !== false) {
    //   const defaultMetricsOptions: DefaultMetricsCollectorConfiguration = {
    //     register: registry,
    //   };
    //   if (prefix) {
    //     defaultMetricsOptions.prefix = prefix;
    //   }
    //   collectDefaultMetrics(defaultMetricsOptions);
    // }

    return registry;
  }
}
