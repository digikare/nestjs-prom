import { createParamDecorator } from '@nestjs/common';
import { findOrCreateHistogram } from './prom.utils';
import { IMetricArguments } from '../interfaces';

export interface IPromHistogramDecoratorArg {
  name: string;
  help?: string;
};

export const PromHistogram = createParamDecorator((data: IPromHistogramDecoratorArg | string) => {

  const arg: Partial<IMetricArguments> = {};

  if (typeof data === 'string') {
    arg.name = data;
  }
  if (typeof data === 'object') {
    arg.name = data.name;
    arg.help = data?.help;
  }

  if (!arg.name || arg.name.length === 0) {
    throw new Error(`PromHistogram need an argument, must be a fulfilled string or IPromHistogramDecoratorArg instance`);
  }

  return findOrCreateHistogram(arg as IMetricArguments);
});
