import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CounterMetric, PromMethodCounter, PromInstanceCounter, PromCounter } from '../../lib';
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
  ) {
    this._counterMetric = this.promService.getCounterMetric('testing');
  }

  @Get()
  @PromMethodCounter()
  root(
    @PromCounter({ name: 'app_testing_counter_object_total' }) counterObject: CounterMetric<string>,
    @PromCounter('app_testing_counter_string_total') counterString: CounterMetric<string>,
  ): string {

    const counterMetric = this.promService.getCounter({name: 'test_on_the_fly'});
    counterMetric.inc(1);

    counterObject.inc(1);
    counterString.inc(1);

    return this.appService.root();
  }

  @Get('test')
  @PromMethodCounter({ name: 'app_testing_method_counter_test' })
  test(): string {
    this._counterMetric.inc(1);
    new MyObj();
    return 'test';
  }
}
