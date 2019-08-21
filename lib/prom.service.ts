import { Injectable } from '@nestjs/common';
import { findOrCreateCounter, findOrCreateGauge, findOrCreateHistogram } from './common/prom.utils';

@Injectable()
export class PromService {
  getCounterMetric(name: string) {
    return findOrCreateCounter({ name });
  }

  getGaugeMetric(name: string) {
    return findOrCreateGauge({ name });
  }

  getHistogramMetric(name: string) {
    return findOrCreateHistogram({ name });
  }

  getSummaryMetric(name: string) {
    return findOrCreateHistogram({ name });
  }
}
