import { Injectable } from '@nestjs/common';
import { findOrCreateCounter, findOrCreateGauge, findOrCreateHistogram, findOrCreateSummary } from './common/prom.utils';
import { IMetricArguments } from './interfaces';

@Injectable()
export class PromService {

  getCounter(args: IMetricArguments) {
    return findOrCreateCounter(args);
  }

  getCounterMetric(name: string) {
    return this.getCounter({ name: name });
  }

  getGauge(args: IMetricArguments) {
    return findOrCreateGauge(args);
  }

  getGaugeMetric(name: string) {
    return this.getGauge({ name: name });
  }

  getHistogram(args: IMetricArguments) {
    return findOrCreateHistogram(args);
  }

  getHistogramMetric(name: string) {
    return this.getHistogram({ name: name });
  }

  getSummary(args: IMetricArguments) {
    return findOrCreateSummary(args);
  }

  getSummaryMetric(name: string) {
    return this.getSummary({ name: name });
  }
  
}
