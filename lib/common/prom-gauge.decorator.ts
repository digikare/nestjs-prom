import { createParamDecorator } from '@nestjs/common';
import { findOrCreateGauge } from './prom.utils';
import { IMetricArguments } from '../interfaces';

export const PromGauge = createParamDecorator((data: IMetricArguments | string) => {

  const arg: Partial<IMetricArguments> = {};

  if (typeof data === 'string') {
    arg.name = data;
  }
  if (typeof data === 'object') {
    arg.name = data.name;
    arg.help = data?.help;
    arg.labelNames = data.labelNames;
  }

  if (!arg.name || arg.name.length === 0) {
    throw new Error(`PromGauge need an argument, must be a fulfilled string or IPromGaugeDecoratorArg instance`);
  }

  return findOrCreateGauge(arg as IMetricArguments);
});
