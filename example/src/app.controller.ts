import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CounterMetric, InjectCounterMetric, PromMethodCounter, PromInstanceCounter } from '../../lib';
import { PromService } from '../../lib/prom.service';

@PromInstanceCounter
class MyObj {
}

@PromInstanceCounter
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectCounterMetric('index_counter') private readonly _counterMetric: CounterMetric,
    private readonly promService: PromService,
  ) {}

  @Get()
  @PromMethodCounter()
  root(): string {

    const counterMetric = this.promService.getCounterMetric('test_on_the_fly');
    counterMetric.inc(1);

    return this.appService.root();
  }

  @Get('test')
  @PromMethodCounter()
  test(): string {
    this._counterMetric.inc(1, new Date());
    new MyObj();
    return 'test';
  }
}
