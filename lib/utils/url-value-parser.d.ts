declare module "url-value-parser" {
  interface ValueDetectorOptions {
    extraMasks?: Array<RegExp>;
  }

  class UrlValueParser {
    constructor(options?: ValueDetectorOptions);
    replacePathValues(path: string, replacement: string): string;
  }

  export = UrlValueParser;
}
