import { Module, DynamicModule } from '@nestjs/common';
import { PromCoreModule } from './prom-core.module';
import { PromModuleOptions } from './interfaces';
import { PromController } from './prom.controller';
import { APP_FILTER } from '@nestjs/core';
import { PromCatchAllExceptionsFilter } from './prom-catch-all.exception-filter';

@Module({})
export class PromModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      withDefaultController,
      withExceptionFilter,
      metricPath,
      customUrl,
    } = options;

    const moduleForRoot: DynamicModule = {
      module: PromModule,
      imports: [PromCoreModule.forRoot(options)],
      controllers: [],
      providers: [],
      exports: [
        PromCoreModule
      ],
    };

    // default push default controller
    if (withDefaultController !== false) {
      moduleForRoot.controllers = [...moduleForRoot.controllers, PromController.forRoot(metricPath ?? customUrl)];
    }

    if (withExceptionFilter !== false) {
      moduleForRoot.providers = [
        ...moduleForRoot.providers,
        {
          provide: APP_FILTER,
          useClass: PromCatchAllExceptionsFilter,
        },
      ];
    }

    return moduleForRoot;
  }
}
