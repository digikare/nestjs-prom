
import * as client from 'prom-client';
import { GenericMetric, CounterMetric, GaugeMetric, HistogramMetric, SummaryMetric } from '../interfaces';

export type MetricType = 'Counter' | 'Gauge' | 'Histogram' | 'Summary';

export function getMetricToken(type: string, name: string) {
  return `${name}${type}`;
}

export function getRegistryName(name: string) {
  return `${name}PromRegistry`;
}

export function getOptionsName(name: string) {
  return `${name}PromOptions`;
}

export const findOrCreateMetric = ({
  name,
  type,
  help,
  labelNames,
}: {
  name: string;
  type: MetricType;
  help?: string;
  labelNames?: string[];
}): GenericMetric => {
  let metric: GenericMetric = client.register.getSingleMetric(name);

  if (!metric) {

    switch (type) {
      case "Counter":
        return new client.Counter({
          name: name,
          help: help || `${name} ${type}`,
          labelNames,
        });
      case "Gauge":
        return new client.Gauge({
          name: name,
          help: help || `${name} ${type}`,
          labelNames,
        });
      case "Histogram":
        return new client.Histogram({
          name: name,
          help: help || `${name} ${type}`,
          labelNames,
        });
      case "Summary":
        return new client.Histogram({
          name: name,
          help: help || `${name} ${type}`,
          labelNames,
        });
      default:
        throw new Error(`Type ${type} not supported`);
    }
  }

  return metric;  
}

export const findOrCreateCounter = ({
  name,
  help,
  labelNames,
}: {
  name: string;
  help?: string;
  labelNames?: string[];
}): CounterMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Counter`,
    labelNames,
  }) as CounterMetric;
};

export const findOrCreateGauge = ({
  name,
  help,
  labelNames,
}: {
  name: string;
  help?: string;
  labelNames?: string[];
}): GaugeMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Gauge`,
    labelNames,
  }) as GaugeMetric;
};

export const findOrCreateHistogram = ({
  name,
  help,
  labelNames,
}: {
  name: string;
  help?: string;
  labelNames?: string[];
  }): HistogramMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Histogram`,
    labelNames,
  }) as HistogramMetric;
};

export const findOrCreateSummary = ({
  name,
  help,
  labelNames,
}: {
  name: string;
  help?: string;
  labelNames?: string[];
}): SummaryMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Summary`,
    labelNames,
  }) as SummaryMetric;
};
