# Migrate from 0.2.x to 1.x

The previous metric declarations on module import is now deprecated in flavor of decorators more simple to use.

You don't need to declare all the metrics to use on your module, simply call it.

## Setup metrics and inject

On this new version

- no need to declare metric with `PromModule.forMetrics()`.
- decorators `@Inject{type}Metric()` are deprecated
  - `@InjectCounterMetric()` are replaced by `@PromCoutner()`
  - `@InjectGaugeMetric()` are replaced by `@PromGauge()`
  - `@InjectHistogramMetric()` are replaced by `@PromHistogram()`
  - `@InjectSumarryMetric()` are replaced by `@PromSummary()`

## Example

### Before with v0.2.x

```typescript
// file: my.module.ts
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

// file: my.service.ts
import { Injectable } from '@nestjs/common';
import {
  InjectCounterMetric,
  InjectGaugeMetric,
  InjectHistogramMetric,
  InjectSummaryMetric,
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  SummaryMetric,
} from '@digikare/nest-prom';

@Injectable()
export class MyService {
  constructor(
    @InjectCounterMetric('my_counter') private readonly _counterMetric: CounterMetric,
    @InjectGaugeMetric('my_gauge') private readonly _gaugeMetric: GaugeMetric,
    @InjectHistogramMetric('my_histogram') private readonly _histogramMetric: HistogramMetric,
    @InjectSummaryMetric('my_summary') private readonly _summaryMetric: SummaryMetric,
  ) {}

  doStuff() {
    this._counterMetric.inc();
  }

  resetCounter() {
    this._counterMetric.reset();
  }
}
```

### After with v1.x

```typescript

// file: my.module.ts
import { Module } from '@nestjs/common';
import { PromModule, MetricType } from '@digikare/nest-prom';

@Module({
  imports: []
})
export class MyModule

// file: my.service.ts
iimport { Injectable } from '@nestjs/common';
import {
  CounterMetric,
  PromCounter,
  GaugeMetric,
  PromGauge,
  PromHistogram,
  HistogramMetric,
  PromSummary,
  SummaryMetric,
} from '@digikare/nest-prom';

@Injectable()
export class MyService {
  constructor(
    @PromCounter('my_counter') private readonly _counterMetric: CounterMetric,
    @PromGauge('my_gauge') private readonly _gaugeMetric: GaugeMetric,
    @PromHistogram('my_histogram') private readonly _histogramMetric: HistogramMetric,
    @PromSummary('my_summary') private readonly _summaryMetric: SummaryMetric,
  ) {}

  doStuff() {
    this._counterMetric.inc();
  }

  resetCounter() {
    this._counterMetric.reset();
  }
}

```
