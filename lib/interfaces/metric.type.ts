
import * as PromClient from 'prom-client';

export enum MetricType {
  Counter,
  Gauge,
  Histogram,
  Summary,
}

export interface MetricTypeConfigurationInterface {
  type: MetricType;
  configuration?: any;
}

export class MetricTypeCounter<T extends string> implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Counter;
  configuration: PromClient.CounterConfiguration<T>;
}

export class MetricTypeGauge<T extends string> implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Gauge;
  configuration: PromClient.GaugeConfiguration<T>;
}

export class MetricTypeHistogram<T extends string> implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Histogram;
  configuration: PromClient.HistogramConfiguration<T>;
}

export class MetricTypeSummary<T extends string> implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Summary;
  configuration: PromClient.SummaryConfiguration<T>;
}

export interface IMetricArguments {
  name: string;
  help?: string;
  labelNames?: string[];
  registry?: PromClient.Registry;
}

export interface IHistogramMetricArguments extends IMetricArguments {
  buckets?: number[];
}