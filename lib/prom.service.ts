import { Injectable } from '@nestjs/common';
import { findOrCreateCounter, findOrCreateGauge, findOrCreateHistogram } from './common/prom.utils';

@Injectable()
export class PromService {
  getCounterMetric(name: string, labelNames?: string[]) {
    return findOrCreateCounter({ name, labelNames });
  }

  getGaugeMetric(name: string, labelNames?: string[]) {
    return findOrCreateGauge({ name, labelNames });
  }

  getHistogramMetric(name: string, labelNames?: string[]) {
    return findOrCreateHistogram({ name, labelNames });
  }

  getSummaryMetric(name: string, labelNames?: string[]) {
    return findOrCreateHistogram({ name, labelNames });
  }
}
