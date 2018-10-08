import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CounterMetric, InjectCounterMetric } from '../../lib';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectCounterMetric('index_counter') private readonly _counterMetric: CounterMetric,
  ) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('test')
  test(): string {
    this._counterMetric.inc(1, new Date());
    return 'test';
  }
}
