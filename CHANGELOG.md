# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.2.5 - 2020-10-24

### Features
- Add request duration on middleware (PR 36 - thanks @litichevskiydv)

## 0.2.4 - 2020-07-29

Please ignore 0.2.3 breaking change.

### Fixed
- Use Typescript type
- fix HMR support with decorator counter instance

## 0.2.3 - 2020-07-26

BREAKING CHANGE: With prom-client v12, the Metric classes is now a generic class, check the prom-client documentation for more info

### Fixes
- update prom-client to v12 - (thanks @AeroNotix)
- fix counter generic type - (thanks @ZamNick)
- fix typo changelog - (thanks @jakubknejzlik)

## 0.2.2 - 2019-12-18

### Fixes
- Small fix for fastify engine compatibility - (thanks @blackkopcap)

## 0.2.1 - 2019-08-28

### Features
- Add posibility to configure custom url for metric - (thanks @bashleigh)

## 0.2.0 - 2019-08-28

Bump 0.2.0 target nestjs v6

### Features
- Upgrade nestjs package to v6 - (thanks @FSM1)

## 0.1.0 - 2019-08-28

Bump 0.1.0 target nestjs v5

### Features
- Add new decorators
  - @PromMethodCounter
    - This decorator will auto create a counter and increment everytime when the method is called
    - The counter name format is: `app_{className}_{methodName}_calls_total`
  - @PromInstanceCounter
    - This decorator will auto create a counter and increment everytime when an instance of a class is created
    - The counter name format is: `app_{className}_instances_total`

### Fixes
- Update packages-lock due of audit

## 0.0.4 - 2018-10-11
### Fixes
- In middleware, call next() if path is not under monitoring

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
