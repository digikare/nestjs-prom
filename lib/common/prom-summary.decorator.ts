import { createParamDecorator } from '@nestjs/common';
import { findOrCreateSummary } from './prom.utils';
import { IMetricArguments } from '../interfaces';

export interface IPromSummaryDecoratorArg {
  name: string;
  help?: string;
};

export const PromSummary = createParamDecorator((data: IPromSummaryDecoratorArg | string) => {

  const arg: Partial<IMetricArguments> = {};

  if (typeof data === 'string') {
    arg.name = data;
  }
  if (typeof data === 'object') {
    arg.name = data.name;
    arg.help = data?.help;
  }

  if (!arg.name || arg.name.length === 0) {
    throw new Error(`PromSummary need an argument, must be a fulfilled string or IPromSummaryDecoratorArg instance`);
  }

  return findOrCreateSummary(arg as IMetricArguments);
});
