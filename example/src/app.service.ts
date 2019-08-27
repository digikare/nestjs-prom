import { Injectable } from '@nestjs/common';
import { PromService } from '../../lib/prom.service';

@Injectable()
export class AppService {

  constructor(
    private readonly _promService: PromService,
  ) {}

  root(): string {
    this._promService.getCounter({name: 'test'}).inc(1, new Date());
    return 'Hello World!';
  }
}
