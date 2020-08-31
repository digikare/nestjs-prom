import { Module, DynamicModule } from '@nestjs/common';
import { PromCoreModule } from './prom-core.module';
import { PromModuleOptions, PromModuleAsyncOptions } from './interfaces';
import { PromController } from './prom.controller';
import { PromService } from './prom.service';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { PromInterceptor } from './prom.interceptor';
import { PromCatchAllExceptionsFilter } from './prom-catch-all.exception-filter';

@Module({})
export class PromModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      withDefaultController,
      withGlobalInterceptor,
      withExceptionFilter,
      customUrl,
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
      moduleForRoot.controllers = [
        ...moduleForRoot.controllers,
        PromController.forRoot(customUrl),
      ];
    }

    if (withGlobalInterceptor !== false) {
      moduleForRoot.providers = [
        ...moduleForRoot.providers,
        {
          provide: APP_INTERCEPTOR,
          useClass: PromInterceptor,
        },
      ];
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

  static forRootAsync(
    asyncOptions: PromModuleAsyncOptions = {},
    options: Pick<PromModuleOptions, 'withDefaultController' | 'withDefaultsMetrics' | 'withExceptionFilter' | 'withGlobalInterceptor' | 'customUrl'> = {},
  ): DynamicModule {
    const moduleForRoot = PromModule.forRoot(options);
    // override imports core for Async
    moduleForRoot.imports = [
      PromCoreModule.forRootAsync(asyncOptions),
    ];
    return moduleForRoot;
  }
}
