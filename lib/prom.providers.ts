import { DEFAULT_PROM_REGISTRY } from "./prom.constants";
import {
  Counter,
  CounterConfiguration,
  GaugeConfiguration,
  Gauge,
  HistogramConfiguration,
  Histogram,
  SummaryConfiguration,
  Summary,
  Registry,
} from 'prom-client';
import { Provider } from "@nestjs/common";
import { getMetricToken, getRegistryName } from "./common/prom.utils";

export function createPromCounterProvider(
  configuration: CounterConfiguration<string>,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Counter', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Counter({
        ...configuration,
        registers: [registry]
      });
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ],
  };
}

export function createPromGaugeProvider(
  configuration: GaugeConfiguration<string>,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Gauge', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Gauge({
        ...configuration,
        registers: [registry]
      });
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ],
  };
}

export function createPromHistogramProvider(
  configuration: HistogramConfiguration<string>,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Histogram', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Histogram({
        ...configuration,
        registers: [registry]
      });
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ],
  };
}

export function createPromSummaryProvider(
  configuration: SummaryConfiguration<string>,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Summary', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Summary({
        ...configuration,
        registers: [registry]
      });
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ],
  };
}
