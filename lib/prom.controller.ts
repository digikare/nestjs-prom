import { Controller, Get, Header } from "@nestjs/common";
import * as client from 'prom-client';
import { PATH_METADATA } from '@nestjs/common/constants';

@Controller()
export class PromController {
  @Get()
  @Header('Content-Type', client.register.contentType)
  index() {
    return client.register.metrics();
  }

  public static forRoot(path: string) {
    Reflect.defineMetadata(PATH_METADATA, path, PromController);
    return PromController;
  }
}
