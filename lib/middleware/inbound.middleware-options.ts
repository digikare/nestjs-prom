export class InboundMiddlewareOptions{
    constructor(public readonly metricsPath: string, public readonly pathNormalizationExtraMasks: Array<RegExp>) {}
}