import * as PromClient from 'prom-client';
export * from './metric.type';
export * from './prom-options.interface';

// map class to expose
export type CounterMetric = PromClient.Counter<string>;
export type GaugeMetric = PromClient.Gauge<string>;
export type HistogramMetric = PromClient.Histogram<string>;
export type SummaryMetric = PromClient.Summary<string>;
export type GenericMetric = PromClient.Metric<string>;
export type Registry = PromClient.Registry;