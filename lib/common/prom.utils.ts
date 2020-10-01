import * as client from 'prom-client';
import { 
  IMetricArguments, 
  GenericMetric, 
  CounterMetric, 
  GaugeMetric, 
  HistogramMetric, 
  SummaryMetric, 
  Registry,
} from '../interfaces';

type MetricType = 'Counter' | 'Gauge' | 'Histogram' | 'Summary';

const registries = new Map<string, Registry>();

export function getMetricToken(type: string, name: string) {
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

export const findOrCreateMetric = ({
  name,
  type,
  help,
  labelNames,
  registry,
}: {
  name: string;
  type: MetricType;
  help?: string;
  labelNames?: string[];
  registry?: Registry;
}): GenericMetric => {

  const register = registry ?? getDefaultRegistry();

  let metric: GenericMetric = register.getSingleMetric(name);
  if (!metric) {

    switch (type) {
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
        return new client.Summary({
          name: name,
          help: help || `${name} ${type}`,
          labelNames,
        });
      case "Counter":
      default:
        return new client.Counter({
          name: name,
          help: help || `${name} ${type}`,
          labelNames,
        });
    }

  }

  return metric;
}

export const findOrCreateCounter = ({
  name,
  help,
  labelNames,
  registry,
}: IMetricArguments): CounterMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Counter`,
    labelNames,
    registry,
  }) as CounterMetric;
}

export const findOrCreateGauge = ({
  name,
  help,
  labelNames,
  registry,
}: IMetricArguments): GaugeMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Gauge`,
    labelNames,
    registry,
  }) as GaugeMetric;
}

export const findOrCreateHistogram = ({
  name,
  help,
  labelNames,
  registry,
}: IMetricArguments): HistogramMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Histogram`,
    labelNames,
    registry,
  }) as HistogramMetric;
}

export const findOrCreateSummary = ({
  name,
  help,
  labelNames,
  registry,
}: IMetricArguments): SummaryMetric => {
  return findOrCreateMetric({
    name,
    help,
    type: `Summary`,
    labelNames,
    registry,
  }) as SummaryMetric;
}
