import { Get, Controller, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { 
  CounterMetric, 
  PromMethodCounter, 
  PromInstanceCounter, 
  PromCounter, 
  PromService,
} from '../../lib';

@PromInstanceCounter()
class MyObj {
}

const sleepAsync = (timeoutMS = 500) => new Promise((resolve) => setTimeout(resolve, timeoutMS));
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

@PromInstanceCounter()
@Controller()
export class AppController {

  private readonly _counterMetric: CounterMetric;

  constructor(
    private readonly appService: AppService,
    private readonly promService: PromService,
  ) {
    this._counterMetric = this.promService.getCounterMetric('testing');
  }

  @Get('/PromMethodCounter_1')
  @PromMethodCounter()
  PromMethodCounter_1() {
    return 'PromMethodCounter_1';
  }


  @Get('/PromMethodCounter_labels')
  @PromMethodCounter()
  PromMethodCounter_labels() {
    return 'PromMethodCounter_labels';
  }

  @Get()
  @PromMethodCounter()
  root(
    @PromCounter({ name: 'app_testing_counter_object_total' }) counterObject: CounterMetric,
    @PromCounter('app_testing_counter_string_total') counterString: CounterMetric,
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

    if (Date.now() % 2 === 0) {
      throw new Error('error testing');
    }

    return 'test';
  }

  @Get('403')
  @PromMethodCounter({ name: 'app_testing_method_counter_test' })
  test403(): string {
    this._counterMetric.inc(1);
    new MyObj();

    if (Date.now() % 2 === 0) {
      throw new HttpException('error testing', HttpStatus.FORBIDDEN);
    }

    return 'test';
  }


  @Get('sleep')
  @PromMethodCounter({ name: 'app_testing_method_counter_test' })
  async testSleep(): Promise<string> {
    this._counterMetric.inc(1);
    new MyObj();

    await sleepAsync(getRandomInt(100, 1000));

    if (Date.now() % 3 === 0) {
      throw new HttpException('error testing', HttpStatus.FORBIDDEN);
    }

    return 'test';
  }
  
  @Get('fobidden')
  forbidden() {
    throw new HttpException('error testing', HttpStatus.FORBIDDEN);
  }
  
}
