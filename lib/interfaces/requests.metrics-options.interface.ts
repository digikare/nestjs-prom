export interface RequestsMetricsOptions {
    /**
     * Buckets for requests duration seconds histogram
     */
    timeBuckets?: Array<number>;

    /**
     * Additional masks for requests paths normalization 
     */
    pathNormalizationExtraMasks?: Array<RegExp>;
}