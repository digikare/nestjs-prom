import * as url from "url";
import UrlValueParser = require("url-value-parser");

export function normalizePath(originalUrl: string, extraMasks: Array<RegExp>, placeholder: string) {
  const { pathname } = url.parse(originalUrl);
  const urlParser = new UrlValueParser({ extraMasks });
  return urlParser.replacePathValues(pathname, placeholder);
}

export function normalizeStatusCode(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return "2XX";
  if (statusCode >= 300 && statusCode < 400) return "3XX";
  if (statusCode >= 400 && statusCode < 500) return "4XX";

  return "5XX";
}
