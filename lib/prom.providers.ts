import { DEFAULT_PROM_REGISTRY } from "./prom.constants";
import * as client from 'prom-client';
import { Provider } from "@nestjs/common";
import { getMetricToken } from "./common/prom.utils";

export function createPromCounterProvider(
  configuration: client.CounterConfiguration
): Provider {
  return {
    provide: getMetricToken('Counter', configuration.name),
    useFactory: () => {
      const obj = new client.Counter(configuration);
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [], // use to inject register
  };
}

export function createPromGaugeProvider(
  configuration: client.GaugeConfiguration
): Provider {
  return {
    provide: getMetricToken('Gauge', configuration.name),
    useFactory: () => {
      const obj = new client.Gauge(configuration);
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [], // use to inject register
  };
}

export function createPromHistogramProvider(
  configuration: client.HistogramConfiguration
): Provider {
  return {
    provide: getMetricToken('Histogram', configuration.name),
    useFactory: () => {
      const obj = new client.Histogram(configuration);
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [], // use to inject register
  };
}

export function createPromSummaryProvider(
  configuration: client.SummaryConfiguration
): Provider {
  return {
    provide: getMetricToken('Summary', configuration.name),
    useFactory: () => {
      const obj = new client.Summary(configuration);
      // to merge register
      // client.Registry.merge([registry, client.register]);
      return obj;
    },
    inject: [], // use to inject register
  };
}
