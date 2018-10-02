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
  configuration: CounterConfiguration,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Counter', configuration.name),
    useFactory: (registry: Registry) => {

      const obj = new Counter({
        ...configuration,
        registers: [registry]
      });
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ], // use to inject register
  };
}

export function createPromGaugeProvider(
  configuration: GaugeConfiguration,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Gauge', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Gauge({
        ...configuration,
        registers: [registry]
      });
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ], // use to inject register
  };
}

export function createPromHistogramProvider(
  configuration: HistogramConfiguration,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Histogram', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Histogram({
        ...configuration,
        registers: [registry]
      });
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ], // use to inject register
  };
}

export function createPromSummaryProvider(
  configuration: SummaryConfiguration,
  registryName: string = DEFAULT_PROM_REGISTRY,
): Provider {
  return {
    provide: getMetricToken('Summary', configuration.name),
    useFactory: (registry: Registry) => {
      const obj = new Summary({
        ...configuration,
        registers: [registry]
      });
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [
      registryName === DEFAULT_PROM_REGISTRY ?
        DEFAULT_PROM_REGISTRY : getRegistryName(registryName),
    ], // use to inject register
  };
}
