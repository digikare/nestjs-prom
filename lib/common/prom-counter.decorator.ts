import { createParamDecorator } from '@nestjs/common';
import { findOrCreateCounter } from './prom.utils';
import { IMetricArguments } from '../interfaces';

export const PromCounter = createParamDecorator((data: IMetricArguments | string) => {

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
    throw new Error(`PromCounter need an argument, must be a fulfilled string or IPromCounterDecoratorArg instance`);
  }

  return findOrCreateCounter(arg as IMetricArguments);
});
