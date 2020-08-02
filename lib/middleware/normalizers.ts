export function normalizeStatusCode(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return "2XX";
    if (statusCode >= 300 && statusCode < 400) return "3XX";
    if (statusCode >= 400 && statusCode < 500) return "4XX";
  
    return "5XX";
  }