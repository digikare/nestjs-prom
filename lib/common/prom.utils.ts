
import * as client from 'prom-client';
import { IMetricArguments } from '../interfaces';

export function getMetricToken(type: string, name: string) {
  return `${name}${type}`;
}

export function getRegistryName(name: string) {
  return `${name}PromRegistry`;
}

export function getOptionsName(name: string) {
  return `${name}PromOptions`;
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
  type: string;
  help?: string;
  labelNames?: string[];
  registry?: client.Registry;
}): client.Metric<string> => {

  const register = registry ?? client.register;

  let metric: client.Metric<string> = register.getSingleMetric(name);
  if (!metric) {
    return new client.Counter({
      name: name,
      help: help || `${name} ${type}`,
      labelNames,
    });
  }

  if (metric instanceof client.Counter === false) {
    return new client.Counter({
      name: getMetricToken(type, name),
      help: help || `${name} ${type}`,
    });
  }

  return metric;
}

export const findOrCreateCounter = ({
  name,
  help,
  labelNames,
  registry,
}: IMetricArguments): client.Counter<string> => {
  return findOrCreateMetric({
    name,
    help,
    type: `Counter`,
    labelNames,
  }) as client.Counter<string>;
};

export const findOrCreateGauge = ({
  name,
  help,
  labelNames,
}: IMetricArguments): client.Gauge<string> => {
  return findOrCreateMetric({
    name,
    help,
    type: `Gauge`,
    labelNames,
    registry,
  }) as client.Gauge<string>;
};

export const findOrCreateHistogram = ({
  name,
  help,
  labelNames,
  registry,
}: IMetricArguments): client.Histogram<string> => {
  return findOrCreateMetric({
    name,
    help,
    type: `Histogram`,
    labelNames,
    registry,
  }) as client.Histogram<string>;
};

export const findOrCreateSummary = ({
  name,
  help,
  labelNames,
registry,
}: IMetricArguments): client.Summary<string> => {
  return findOrCreateMetric({
    name,
    help,
    type: `Summary`,
    labelNames,
    registry,
  }) as client.Summary<string>;
};
