import * as PromClient from 'prom-client';
export * from './metric.type';
export * from './prom-options.interface';

// map class to expose
export class CounterMetric<T extends string> extends PromClient.Counter<T> {}
export class GaugeMetric<T extends string> extends PromClient.Gauge<T> {}
export class HistogramMetric<T extends string> extends PromClient.Histogram<T> {}
export class SummaryMetric<T extends string> extends PromClient.Summary<T> {}
