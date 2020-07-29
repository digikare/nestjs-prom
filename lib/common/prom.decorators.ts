import { Inject } from '@nestjs/common';
import { getMetricToken, findOrCreateCounter } from './prom.utils';
import { CounterMetric } from '../interfaces';

export const InjectCounterMetric = (name: string) => Inject(getMetricToken(`Counter`, name));
export const InjectGaugeMetric = (name: string) => Inject(getMetricToken(`Gauge`, name));
export const InjectHistogramMetric = (name: string) => Inject(getMetricToken(`Histogram`, name));
export const InjectSummaryMetric = (name: string) => Inject(getMetricToken(`Summary`, name));

/**
 * Create and increment a counter when the method is called
 */
export const PromMethodCounter = () => {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
        const className = target.constructor.name;
        const name = `app_${className}_${propertyKey.toString()}_calls_total`;
        const help = `app_${className}#${propertyKey.toString()} called total`;
        const methodFunc = descriptor.value;
        let counterMetric: CounterMetric = undefined;
        
        descriptor.value = function (...args: any[]) {
            if (!counterMetric) {
                counterMetric = findOrCreateCounter({ name, help });
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
export const PromInstanceCounter = <T extends { new(...args: any[]): {} }>(ctor: T) => {
    const name = `app_${ctor.name}_instances_total`;
    const help = `app_${ctor.name} object instances total`;
    let counterMetric: CounterMetric = undefined;

    return class extends ctor {
        constructor(...args) {
            if (!counterMetric) {
                counterMetric = findOrCreateCounter({ name, help });
            }
            counterMetric.inc(1);
            super(...args);
        }
    }
};
