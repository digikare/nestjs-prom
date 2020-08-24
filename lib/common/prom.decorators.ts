import { findOrCreateCounter } from './prom.utils';
import { IMetricArguments, CounterMetric } from '../interfaces';
import { Inject } from '@nestjs/common';
import { PromService } from '../prom.service';

/**
 * Create and increment a counter when the method is called
 */
export const PromMethodCounter = (params?: IMetricArguments) => {
    const injectPromService = Inject(PromService);

    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {

        injectPromService(target, '__promService');

        const className = target.constructor.name;
        const name = `app_${className}_${propertyKey.toString()}_calls_total`;
        const help = `app_${className}#${propertyKey.toString()} called total`;
        let counterMetric: CounterMetric;

        const methodFunc = descriptor.value;
        descriptor.value = function (...args: any[]) {

            if (!counterMetric) {
                const promService: PromService = this.__promService;
                counterMetric = promService.getCounter({ 
                    name,
                    help,
                    ...params,
                });
            }
            counterMetric.inc(1);
            return methodFunc.apply(this, args);
        };
    };
}

/**
 * Create and increment a counter when a new instance is created
 *
 * @param ctor
 */
export const PromInstanceCounter = (params?: IMetricArguments) => {
    return <T extends { new(...args: any[]): {} }>(ctor: T) => {
        const name = `app_${ctor.name}_instances_total`;
        const help = `app_${ctor.name} object instances total`;
        let counterMetric: CounterMetric;

        return class extends ctor {
            constructor(...args) {
                if (!counterMetric) {
                    counterMetric = findOrCreateCounter({
                        name,
                        help,
                        ...params,
                    });
                }

                counterMetric.inc(1);
                super(...args);
            }
        }
    };
}
