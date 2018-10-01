import { Controller, Get, Res } from "@nestjs/common";
import * as client from 'prom-client';

@Controller('metrics')
export class PromController {
  @Get()
  index(@Res() res) {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
  }
}