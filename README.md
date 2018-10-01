

## Description

A promotheus module for Nest.

## Installation

```bash
$ npm install --save @digikare/nestjs-prom
```

## How to use

Import `PromModule` into the root `ApplicationModule`

```typescript
import { Module } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'my_app',
      }
    }),
  ]
})
export class ApplicationModule {}
```

### Setup a counter metric

In your module, use `forMetrics()` method to define the metrics needed.

```typescript
import { Module } from '@nestjs/common';
import { PromModule, MetricType } from '@digikare/nest-prom';

@Module({
  imports: [
    PromModule.forMetrics([
      {
        type: MetricType.Counter,
        configuration: {
          name: 'my_counter',
          help: 'my_counter a simple counter',
        }
      }
    ]),
  ]
})
export class MyModule
```

And you can use `@InjectCounterMetric()` decorator

```typescript
import { Injectable } from '@nestjs/common';
import { InjectCounterMetric, CounterMetric } from '@digikare/nest-prom';

@Injectable()
export class MyService {
  constructor(
    @InjectCounterMetric('my_counter') private readonly _counterMetric: CounterMetric,
  ) {}

  doStuff() {
    this._counterMetric.inc();
  }

  resetCounter() {
    this._counterMetric.reset();
  }
}
```

## TODO

- Update readme
  - Gauge
  - Histogram
  - Summary
- Manage registries

## License

MIT licensed
