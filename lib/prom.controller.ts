import { Controller, Get, Res } from "@nestjs/common";
import * as client from 'prom-client';
import { PATH_METADATA } from '@nestjs/common/constants';

@Controller()
export class PromController {
  @Get()
  index(@Res() res) {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
  }

  public static forRoot(path: string) {
    Reflect.defineMetadata(PATH_METADATA, path, PromController);
    return PromController;
  }
}