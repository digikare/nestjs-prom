import { findOrCreateCounter } from './prom.utils';
import { IMetricArguments } from '../interfaces';

/**
 * Create and increment a counter when the method is called
 */
export const PromMethodCounter = (params?: IMetricArguments) => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
        const className = target.constructor.name;
        const counterMetric = findOrCreateCounter({
            name: `app_${className}_${propertyKey.toString()}_calls_total`,
            help: `app_${className}#${propertyKey.toString()} called total`,
            ...params,
        });
        const methodFunc = descriptor.value;
        descriptor.value = function (...args: any[]) {
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
        const counterMetric = findOrCreateCounter({
            name: `app_${ctor.name}_instances_total`,
            help: `app_${ctor.name} object instances total`,
            ...params,
        });
        return class extends ctor {
            constructor(...args) {
                counterMetric.inc(1);
                super(...args);
            }
        }
    };
}
