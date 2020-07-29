

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

### Setup metric

In your module, use `forMetrics()` method to define the metrics needed.

```typescript
import { Module } from '@nestjs/common';
import { PromModule, MetricType } from '@digikare/nestjs-prom';

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

And you can use `@InjectCounterMetric()` decorator to get the metrics

```typescript
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
} from '@digikare/nestjs-prom';

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

### Metric class instances

```typescript
@PromInstanceCounter
export class MyClass {

}
```

Will generate a counter called: `app_MyClass_instances_total`

### Metric method calls

```typescript
@Injectable()
export class MyService {
  @PromMethodCounter()
  doMyStuff() {

  }
}
```

Will generate a counter called: `app_MyService_doMyStuff_calls_total`

### Metric endpoint

The default metrics endpoint is `/metrics` this can be changed with the customUrl option

```ts
@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'my_app',
      },
      customUrl: 'custom/uri',
    }),
  ],
})
export class MyModule
```

Now your metrics can be found at `/custom/uri`.

> PS: If you have a global prefix, the path will be `{globalPrefix}/metrics` for
the moment.

## API

### PromModule.forRoot() options

- `withDefaultsMetrics: boolean (default true)` enable defaultMetrics provided by prom-client
- `withDefaultController: boolean (default true)` add internal controller to expose /metrics endpoints
- `useHttpCounterMiddleware: boolean (default false)` register http_requests_total counter

## Auth/security

I do not provide any auth/security for `/metrics` endpoints.
This is not the aim of this module, but depending of the auth strategy, you can
apply a middleware on `/metrics` to secure it.

## TODO

- Update readme
  - Gauge
  - Histogram
  - Summary
- Manage registries
- Tests
- Give possibility to custom metric endpoint
- Adding example on how to secure `/metrics` endpoint
  - secret
  - jwt

## License

MIT licensed
