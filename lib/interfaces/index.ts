
import * as PromClient from 'prom-client';
export * from './metric.type';
export * from './prom-options.interface';

// map class to expose
export class CounterMetric extends PromClient.Counter {}
export class GaugeMetric extends PromClient.Gauge {}
export class HistogramMetric extends PromClient.Histogram {}
export class SummaryMetric extends PromClient.Summary {}
