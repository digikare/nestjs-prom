import * as url from 'url';
import UrlValueParser = require('url-value-parser');

export function normalizePath(
  originalUrl: string,
  extraMasks: Array<RegExp>,
  placeholder: string,
) {
  const { pathname } = url.parse(originalUrl);
  const urlParser = new UrlValueParser({ extraMasks });
  return urlParser.replacePathValues(pathname, placeholder);
}

export function normalizeStatusCode(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return '2XX';
  if (statusCode >= 300 && statusCode < 400) return '3XX';
  if (statusCode >= 400 && statusCode < 500) return '4XX';

  return '5XX';
}

export function normalizeRoute(req,includeQueryParams = false): string {
  let normalizedRoutePath = req.baseUrl;


  if (req.route) {
    let endpointRoutePath = req.route.path;
    if (endpointRoutePath == '/*') {
      // that means the requested route doesn't exist
      return 'unknown';
    }

    if (endpointRoutePath !== '/') {
      normalizedRoutePath = normalizedRoutePath
        ? normalizedRoutePath + endpointRoutePath
        : endpointRoutePath;
    }

    let originalUrl = req.originalUrl;

    let lastUrlChar = originalUrl.substr(originalUrl.length - 1);
    // remove redundant trailing slash
    if (lastUrlChar === '/') {
      originalUrl = originalUrl.substr(0, originalUrl.length - 1);
    }

    if (
      !normalizedRoutePath ||
      normalizedRoutePath === '' ||
      typeof normalizedRoutePath !== 'string'
    ) {
      // normalizedRoutePath = originalUrl.split('?')[0];
      // in case the requested route doesn't exist
      return 'unknown';
    } else {
      const splittedRoute = normalizedRoutePath.split('/');
      const splittedUrl = originalUrl.split('?')[0].split('/');
      const routeIndex = splittedUrl.length - splittedRoute.length + 1;
      const baseUrl = splittedUrl.slice(0, routeIndex).join('/');
      normalizedRoutePath = baseUrl + normalizedRoutePath;
    }

    if (includeQueryParams === true && Object.keys(req.query).length > 0) {
      normalizedRoutePath = `${normalizedRoutePath}?${Object.keys(req.query)
        .sort()
        .map((queryParam) => `${queryParam}=<?>`)
        .join('&')}`;
    }
  }
  // nest.js - build request url pattern if exists params
  if (typeof req.params === 'object') {
    Object.keys(req.params).forEach((paramName) => {
      normalizedRoutePath = normalizedRoutePath.replace(
        req.params[paramName],
        ':' + paramName,
      );
    });
  }
  // this condition will evaluate to true only in
  // express framework and no route was found for the request. if we log this metrics
  // we'll risk in a memory leak since the route is not a pattern but a hardcoded string.
  if (!normalizedRoutePath || normalizedRoutePath === '') {
    normalizedRoutePath = 'N/A';
  }
  return normalizedRoutePath;
}
