import { Injectable } from '@nestjs/common';
import { CounterMetric, InjectCounterMetric } from '../../lib';

@Injectable()
export class AppService {

  constructor(
    @InjectCounterMetric('index_counter') private readonly _counterMetric: CounterMetric<string>,
  ) {}

  root(): string {
    this._counterMetric.inc(1);
    return 'Hello World!';
  }
}
