
import * as client from 'prom-client';

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
}: {
  name: string;
  type: string;
  help?: string;
}): client.Metric => {

  let metric: client.Metric = client.register.getSingleMetric(name);
  if (!metric) {
    return new client.Counter({
      name: name,
      help: help || `${name} ${type}`,
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
}: {
  name: string,
  help?: string,
}): client.Counter => {
  return findOrCreateMetric({
    name,
    help,
    type: `Counter`,
  }) as client.Counter;
}

export const findOrCreateGauge = ({
  name,
  help,
}: {
  name: string,
  help?: string,
}): client.Gauge => {
  return findOrCreateMetric({
    name,
    help,
    type: `Gauge`,
  }) as client.Gauge;
}

export const findOrCreateHistogram = ({
  name,
  help,
}: {
  name: string,
  help?: string,
}): client.Histogram => {
  return findOrCreateMetric({
    name,
    help,
    type: `Histogram`,
  }) as client.Histogram;
}

export const findOrCreateSummary = ({
  name,
  help,
}: {
  name: string,
  help?: string,
}): client.Summary => {
  return findOrCreateMetric({
    name,
    help,
    type: `Summary`,
  }) as client.Summary;
}
