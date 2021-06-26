import { Inject, Injectable } from '@nestjs/common';
import { Pushgateway } from 'prom-client';
import {
  findOrCreateCounter,
  findOrCreateGauge,
  findOrCreateHistogram,
  findOrCreateSummary,
  getDefaultRegistry,
} from './common/prom.utils';
import { IHistogramMetricArguments, IMetricArguments } from './interfaces';
import { PROM_PUSHGATEWAY } from './prom.constants';

@Injectable()
export class PromService {

  constructor(
      @Inject(PROM_PUSHGATEWAY)
      private readonly pushgateway: Pushgateway
  ) {}

  getPushgateway() {
      return this.pushgateway;
  }

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

  getHistogram(args: IHistogramMetricArguments) {
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

  /**
   * Return the default registry
   */
  getDefaultRegistry() {
    return getDefaultRegistry();
  }

}
