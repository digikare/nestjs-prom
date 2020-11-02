import * as client from 'prom-client';
import {
  IMetricArguments,
  GenericMetric,
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  SummaryMetric,
  Registry,
  IHistogramMetricArguments,
} from '../interfaces';

type MetricType = 'Counter' | 'Gauge' | 'Histogram' | 'Summary';

const registries = new Map<string, Registry>();

export function getMetricToken(type: MetricType, name: string) {
  return `${name}${type}`;
}

export function getRegistryName(name: string) {
  return `${name}PromRegistry`;
}

export function getOptionsName(name: string) {
  return `${name}PromOptions`;
}

export function getRegistry(name?: string) {
  if (!name) {
    return getDefaultRegistry();
  }

  if (registries.has(name) === false) {
    const registry = new client.Registry();
    registries.set(name, registry);
  }

  return registries.get(name);
}

export function getDefaultRegistry() {
  return client.register;
}

export function findOrCreateMetric({
  name,
  type,
  help,
  labelNames,
  registry,
  buckets,
}: {
  name: string;
  type: MetricType;
  help?: string;
  labelNames?: string[];
  registry?: Registry;
  buckets?: number[];
}): GenericMetric {

  const register = registry ?? getDefaultRegistry();
  let metric: GenericMetric = register.getSingleMetric(name);

  switch (type) {
    case "Gauge":
      if (metric && metric instanceof client.Gauge) {
        return metric;
      }
      return new client.Gauge({
        name: name,
        help: help || `${name} ${type}`,
        labelNames,
      });
    case "Histogram":
      if (metric && metric instanceof client.Histogram) {
        return metric;
      }
      const histogramConfig = {
        name: name,
        help: help || `${name} ${type}`,
        labelNames,
      };
      if (buckets) {
        histogramConfig['buckets'] = buckets;
      }
      return new client.Histogram(histogramConfig);
    case "Summary":
      if (metric && metric instanceof client.Summary) {
        return metric;
      }
      return new client.Summary({
        name: name,
        help: help || `${name} ${type}`,
        labelNames,
      });
    case "Counter":
    default:
      if (metric && metric instanceof client.Counter) {
        return metric;
      }
      return new client.Counter({
        name: name,
        help: help || `${name} ${type}`,
        labelNames,
      });
  }
}

export function findOrCreateCounter(args: IMetricArguments): CounterMetric {
  return findOrCreateMetric({
    ...args,
    type: `Counter`,
  }) as CounterMetric;
}

export function findOrCreateGauge(args: IMetricArguments): GaugeMetric {
  return findOrCreateMetric({
    ...args,
    type: `Gauge`,
  }) as GaugeMetric;
}

export function findOrCreateHistogram(args: IHistogramMetricArguments): HistogramMetric {
  return findOrCreateMetric({
    ...args,
    type: `Histogram`,
  }) as HistogramMetric;
}

export function findOrCreateSummary(args: IMetricArguments): SummaryMetric {
  return findOrCreateMetric({
    ...args,
    type: `Summary`,
  }) as SummaryMetric;
}
