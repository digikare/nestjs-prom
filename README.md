# nestjs-prom v1.x

A prometheus module for Nest.

__BREAKING CHANGE__

> nestjs-prom v0.2.x has been moved to [stable/0.2](https://github.com/digikare/nestjs-prom/tree/stable/0.2) branch.
>
> To migrate from v0.2 to v1.x please see [Migrate from 0.2.x to 1.x](./doc/migrate_0.2_1.x.md)

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
        version: 'x.y.z',
      }
    }),
  ]
})
export class ApplicationModule {}
```

### PromModule.forRoot options

Here the options available for PromModule.forRoot:

|Option|Type|Default|Description|
|---|---|---|---|
|defaultLabels|Object<string, string|number>|`{}`|The defaults labels to set|
|metricPath|string|`/metrics`|Path to use to service metrics|
|withDefaultsMetrics|boolean|`true`|enable defaultMetrics provided by prom-client|
|withDefaultController|boolean|`true`|add internal controller to expose /metrics endpoints|
|withHttpMiddleware|object|`{}`|Tttp middleware options for http requests metrics|
|withHttpMiddleware.enable|boolean|`false`|Enable the middleware for http requests|
|withHttpMiddleware.timeBuckets|number[]|`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10]`|The time buckets wanted|
|withHttpMiddleware.pathNormalizationExtraMasks|RegEx[]| `[]` |The regexp mask for normalization|

### Http requests

To track the http requests metrics, simply set  `withHttpMiddleware.enable = true`

By default, this feature is disabled.

```typescript
import { Module } from '@nestjs/common';
import { PromModule } from '@digikare/nestjs-prom';

@Module({
  imports: [
    PromModule.forRoot({
      withHttpMiddleware: {
        enable: true,
      }
    }),
  ]
})
export class ApplicationModule {}
```

### Setup metric

To setup a metric, the module provide multiple ways to get a metric.

#### Using PromService and Dependency Injection

By using `PromService` service with DI to get a metric.

```typescript
@Injectable()
export class MyService {

  private readonly _counter: CounterMetric;
  private readonly _gauge: GaugeMetric,
  private readonly _histogram: HistogramMetric,
  private readonly _summary: SummaryMetric,

  constructor(
    private readonly promService: PromService,
  ) {
    this._counter = this.promService.getCounter({ name: 'my_counter' });
  }

  doSomething() {
    this._counter.inc(1);
  }

  reset() {
    this._counter.reset();
  }
}
```

#### Using Param Decorator

You have the following decorators:

- `@PromCounter()`
- `@PromGauge()`
- `@PromHistogram()`
- `@PromSummary()`

Below how to use it

```typescript
import { CounterMetric, PromCounter } from '@digikare/nest-prom';

@Controller()
export class AppController {

  @Get('/home')
  home(
    @PromCounter('app_counter_1_inc') counter1: CounterMetric,
    @PromCounter({ name: 'app_counter_2_inc', help: 'app_counter_2_help' }) counter2: CounterMetric,
  ) {
    counter1.inc(1);
    counter2.inc(2);
  }

  @Get('/home2')
  home2(
    @PromCounter({ name: 'app_counter_2_inc', help: 'app_counter_2_help' }) counter: CounterMetric,
  ) {
    counter.inc(2);
  }
}
```

```typescript
import { GaugeMetric, PromGauge } from '@digikare/nest-prom';

@Controller()
export class AppController {

  @Get('/home')
  home(
    @PromGauge('app_gauge_1') gauge1: GaugeMetric,
  ) {
    gauge1.inc(); // 1
    gauge1.inc(5); // 6
    gauge1.dec(); // 5
    gauge1.dec(2); // 3
    gauge1.set(10); // 10
  }
}
```

### Metric class instances

If you want to counthow many instance of a specific class has been created:

```typescript
@PromInstanceCounter()
export class MyClass {

}
```

Will generate a counter called: `app_MyClass_instances_total`

### Metric method calls

If you want to increment a counter on each call of a specific method:

```typescript
@Injectable()
export class MyService {
  @PromMethodCounter()
  doMyStuff() {

  }
}
```

Will generate a counter called: `app_MyService_doMyStuff_calls_total` and auto increment on each call

You can use that to monitor an endpoint

```typescript
@Controller()
export class AppController {
  @Get()
  @PromMethodCounter() // will generate `app_AppController_root_calls_total` counter
  root() {
    // do your stuff
  }

  @Get('/login')
  @PromMethodCounter({ name: 'app_login_endpoint_counter' })  // set the counter name
  login() {
    // do your stuff
  }
}
```

### Metric endpoint

The default metrics endpoint is `/metrics` this can be changed with the metricPath option

```ts
@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'my_app',
      },
      metricPath: 'custom/uri',
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

|Option|Type|Default|Description|
|---|---|---|---|
|defaultLabels|Object<string, string|number>|`{}`|The defaults labels to set|
|metricPath|string|`/metrics`|Path to use to service metrics|
|withDefaultsMetrics|boolean|`true`|enable defaultMetrics provided by prom-client|
|withDefaultController|boolean|`true`|add internal controller to expose /metrics endpoints|
|withHttpMiddleware|object|`{}`|To enable the http middleware for http metrics|
|withHttpMiddleware.enable|boolean|`false`|Enable http middleware|
|withHttpMiddleware.timeBuckets|number[]|`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10]`|The time buckets wanted|
|withHttpMiddleware.pathNormalizationExtraMasks|RegEx[]| `[]` |The regexp mask for normalization|

### Decorators

- `@PromInstanceCounter()` Class decorator, create and increment on each instance created
- `@PromMethodCounter()` Method decorator, create and increment each time the method is called
- `@PromCounter()` Param decorator, create/find counter metric
- `@PromGauge()` Param decorator, create/find gauge metric
- `@PromHistogram()` Param decorator, create/find histogram metric
- `@PromSummary()` Param decorator, create/find summary metric

## Auth/security

I do not provide any auth/security for `/metrics` endpoints.
This is not the aim of this module, but depending of the auth strategy, you can
apply a middleware on `/metrics` to secure it.

## License

MIT licensed
