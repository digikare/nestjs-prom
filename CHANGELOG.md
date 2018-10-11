# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.0.3 - 2018-10-11
### Changed
- `http_requests_total` only count the number of requests received

## 0.0.2 - 2018-10-08
### Added
- new options `PromModule.forRoot`
  - `withDefaultsMetrics: boolean (default true)` enable defaultMetrics provided by prom-client
  - `withDefaultController: boolean (default true)` add internal controller to expose /metrics endpoints
  - `useHttpCounterMiddleware: boolean (default false)` register http_requests_total counter
- Provide `http_requests_total` counter if `useHttpCounterMiddleware` enabled
  - ignore `/metrics`
  - ignore `/favicon.ico`
- Provide default counter with `/metrics` endpoint if `withDefaultController` enabled
- Example folder

## 0.0.1 - 2018-10-01
### Added
- Initial version
- Setup Changelog
- Setup README
- Adding metrics type
  - Counter
  - Gauge
  - Histogram
  - Summary
