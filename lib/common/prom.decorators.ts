import { Inject } from '@nestjs/common';
import { getMetricToken } from './prom.utils';

export const InjectCounterMetric = (name: string) => Inject(getMetricToken(`Counter`, name));
export const InjectGaugeMetric = (name: string) => Inject(getMetricToken(`Gauge`, name));
export const InjectHistogramMetric = (name: string) => Inject(getMetricToken(`Histogram`, name));
export const InjectSummaryMetric = (name: string) => Inject(getMetricToken(`Summary`, name));

// export const InjectRegistry = (name?: string) =>
//   Inject(name ? getRegistryName(name) : '');