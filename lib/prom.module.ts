import { Module, DynamicModule } from '@nestjs/common';
import { PromCoreModule } from './prom-core.module';
import { PromModuleOptions } from './interfaces';
import { PromController } from './prom.controller';
import { PromService } from './prom.service';

@Module({})
export class PromModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      withDefaultController,
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
      moduleForRoot.controllers = [...moduleForRoot.controllers, PromController.forRoot(customUrl)];
    }

    return moduleForRoot;
  }
}
