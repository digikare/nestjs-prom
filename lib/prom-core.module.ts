import {
  Global,
  DynamicModule,
  Module,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PromModuleOptions } from './interfaces';
import { DEFAULT_PROM_REGISTRY, PROM_REGISTRY_NAME } from './prom.constants';

import * as client from 'prom-client';

@Global()
@Module({})
export class PromCoreModule {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      withDefaultsMetrics,
      registryName,
      timeout,
      prefix,
      ...promOptions
    } = options;

    const promRegistryName = registryName
      ? `${registryName}PromClient`
      : DEFAULT_PROM_REGISTRY;

    const clientNameProvider = {
      provide: PROM_REGISTRY_NAME,
      useValue: promRegistryName,
    }

    const clientProvider = {
      provide: promRegistryName,
      useFactory: () => {
        if (withDefaultsMetrics) {
          const defaultMetricsOptions: {[key: string]: any} = {};
          if (timeout) {
            defaultMetricsOptions.timeout = timeout;
          }
          if (prefix) {
            defaultMetricsOptions.prefix = prefix;
          }
          client.collectDefaultMetrics(defaultMetricsOptions);
        }
        return client;
      }
    }

    return {
      module: PromCoreModule,
      providers: [
        clientNameProvider,
        clientProvider,
      ],
      exports: [],
    };
  }

  /**
   * on destroy
   */
  onModuleDestroy() {
  }
}