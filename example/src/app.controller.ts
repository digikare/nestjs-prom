import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CounterMetric, PromMethodCounter, PromInstanceCounter } from '../../lib';
import { PromService } from '../../lib/prom.service';

@PromInstanceCounter()
class MyObj {
}

@PromInstanceCounter()
@Controller()
export class AppController {

  private readonly _counterMetric: CounterMetric<string>

  constructor(
    private readonly appService: AppService,
    private readonly promService: PromService,
  ) {}

  @Get()
  @PromMethodCounter()
  root(): string {

    const counterMetric = this.promService.getCounter({name: 'test_on_the_fly'});
    counterMetric.inc(1);

    return this.appService.root();
  }

  @Get('test')
  @PromMethodCounter()
  test(): string {
    this._counterMetric.inc(1);
    new MyObj();
    return 'test';
  }
}
