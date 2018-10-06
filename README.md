

## Description

A prometheus module for Nest.

## Installation

```bash
$ npm install --save @digikare/nestjs-prom prom-client
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
      },
      {
        type: MetricType.Gauge,
        configuration: {
          name: 'my_gauge',
          help: 'my_gauge a simple gauge',
        }
      },
      {
        type: MetricType.Histogram,
        configuration: {
          name: 'my_histogram',
          help: 'my_histogram a simple histogram',
        }
      },
      {
        type: MetricType.Summary,
        configuration: {
          name: 'my_summary',
          help: 'my_summary a simple summary',
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
    @InjectCounterMetric('my_gauge') private readonly _gaugeMetric: GaugeMetric,
    @InjectCounterMetric('my_histogram') private readonly _histogramMetric: HistogramMetric,
    @InjectCounterMetric('my_summary') private readonly _summaryMetric: SummaryMetric,
  ) {}

  doStuff() {
    this._counterMetric.inc();
  }

  resetCounter() {
    this._counterMetric.reset();
  }
}
```

### Metric endpoint

At the moment, no way to configure the `/metrics` endpoint path.

PS: If you have a global prefix, the path will be `{globalPrefix}/metrics` for
the moment.

## TODO

- Update readme
  - Gauge
  - Histogram
  - Summary
- Manage registries
- Tests
- Give possibility to custom metric endpoint

## License

MIT licensed
