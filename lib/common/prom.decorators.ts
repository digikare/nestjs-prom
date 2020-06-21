import { Inject } from '@nestjs/common';
import { getMetricToken, findOrCreateCounter } from './prom.utils';

export const InjectCounterMetric = (name: string) => Inject(getMetricToken(`Counter`, name));
export const InjectGaugeMetric = (name: string) => Inject(getMetricToken(`Gauge`, name));
export const InjectHistogramMetric = (name: string) => Inject(getMetricToken(`Histogram`, name));
export const InjectSummaryMetric = (name: string) => Inject(getMetricToken(`Summary`, name));

/**
 * Create and increment a counter when the method is called
 */
export const PromMethodCounter = <T extends any> () => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => T>) => {
        const className = target.constructor.name;
        const counterMetric = findOrCreateCounter({
            name: `app_${className}_${propertyKey.toString()}_calls_total`,
            help: `app_${className}#${propertyKey.toString()} called total`,
        });
        const methodFunc = descriptor.value;

        if (!methodFunc) {
            throw new Error('Decorator was invoked not under the method');
        }

        descriptor.value = function (...args: any[]): T {
            counterMetric.inc(1);
            return methodFunc.apply(this, args);
        };
    };
}

/**
 * Create and increment a counter when the async method is called
 */
export const PromAsyncMethodCounter = <T extends any> () => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>) => {
        const className = target.constructor.name;
        const counterMetric = findOrCreateCounter({
            name: `app_${className}_${propertyKey.toString()}_calls_total`,
            help: `app_${className}#${propertyKey.toString()} called total`,
        });
        const methodFunc = descriptor.value;

        if (!methodFunc) {
            throw new Error('Decorator was invoked not under the method');
        }

        descriptor.value = async function (...args: any[]): Promise<T> {
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
export const PromInstanceCounter = <T extends { new(...args: any[]): {} }>(ctor: T) => {
    const counterMetric = findOrCreateCounter({
        name: `app_${ctor.name}_instances_total`,
        help: `app_${ctor.name} object instances total`,
    });
    return class extends ctor {
        constructor(...args) {
            counterMetric.inc(1);
            super(...args);
        }
    }
};
