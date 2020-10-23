import { createParamDecorator } from '@nestjs/common';
import { findOrCreateSummary } from './prom.utils';
import { IMetricArguments } from '../interfaces';

export const PromSummary = createParamDecorator((data: IMetricArguments | string) => {

  const arg: Partial<IMetricArguments> = {};

  if (typeof data === 'string') {
    arg.name = data;
  }
  if (typeof data === 'object') {
    arg.name = data.name;
    arg.help = data.help;
    arg.labelNames = data.labelNames;
  }

  if (!arg.name || arg.name.length === 0) {
    throw new Error(`PromSummary need an argument, must be a fulfilled string or IPromSummaryDecoratorArg instance`);
  }

  return findOrCreateSummary(arg as IMetricArguments);
});
