<h1 align="center">
	Offirmo’s practical logger - TypeScript interfaces<br>
	<a href="https://www.offirmo.net/offirmo-monorepo/0-doc/modules-directory/index.html">
		<img src="https://www.offirmo.net/offirmo-monorepo/public/offirmos_quality_seal.png" alt="Offirmo’s quality seal" width="333">
	</a>
</h1>

<p align="center">
	<a alt="npm package page"
	  href="https://www.npmjs.com/package/@monorepo-private/practical-logger--types">
		<img alt="npm badge"
		  src="https://img.shields.io/npm/v/@monorepo-private/practical-logger--types.svg">
	</a>
	<a alt="dependencies analysis"
	  href="https://david-dm.org/offirmo/offirmo-monorepo?path=stack--current%2F2-foundation%2Fpractical-logger--types">
		<img alt="dependencies badge"
		  src="https://img.shields.io/david/offirmo/offirmo-monorepo.svg?path=stack--current%2F2-foundation%2Fpractical-logger--types">
	</a>
	<a alt="bundle size evaluation"
	  href="https://bundlephobia.com/result?p=@monorepo-private/practical-logger--types">
		<img alt="bundle size badge"
		  src="https://img.shields.io/bundlephobia/minzip/@monorepo-private/practical-logger--types.svg">
	</a>
	<a alt="license"
	  href="https://unlicense.org/">
		<img alt="license badge"
		  src="https://img.shields.io/badge/license-public_domain-brightgreen.svg">
	</a>
	<img alt="maintenance status badge"
	  src="https://img.shields.io/maintenance/yes/2024.svg">
</p>

This is an **internal** module of [Offirmo’s practical logger](https://practical-logger-js.netlify.app/).

- declares only TypeScript types
- **No code, 0 bytes** = will do nothing to your bundle size
- no dependencies

## Usage

**This is most likely not what you are looking for!**

See the actual implementations of those interfaces:

- minimal no-op:
  [@monorepo-private/practical-logger--minimal-noop](https://www.npmjs.com/package/@monorepo-private/practical-logger--minimal-noop)
- browser:
  [@monorepo-private/practical-logger--browser](https://www.npmjs.com/package/@monorepo-private/practical-logger--browser)
- node:
  [@monorepo-private/practical-logger--node](https://www.npmjs.com/package/@monorepo-private/practical-logger--node)

### Interface

A logger will have the following interface:

- `setLevel(level: LogLevel): void`
- `getLevel(): LogLevel`
- `addCommonDetails(hash: Readonly<{ [k: string]: any }>): void`
- Log primitives: (mirroring the log levels)
  - `fatal(message?: string, details?: Readonly<{ [k: string]: any }>): void`
  - `emerg(…) idem`
  - `alert(…) idem`
  - `crit(…) idem`
  - `error(…) idem`
  - `warning(…), warn(…) idem`
  - `notice(…) idem`
  - `info(…) idem`
  - `verbose(…) idem`
  - `log(…) idem`
  - `debug(…) idem`
  - `trace(…) idem`
  - `silly(…) idem`
- those functions are present for convenience but may not do anything (platform-dependent):
  - `group(groupTitle?: string): void`
  - `groupCollapsed(groupTitle?: string): void`
  - `groupEnd(): void`

## Concept

Other loggers:

- https://getpino.io/#/docs/benchmarks
  - pitch https://stackoverflow.com/a/71812457/587407
- discovered later: https://github.com/ianstormtaylor/browser-logger

## Credits

I had a look at bunyan's interface.

TODO https://andydote.co.uk/2023/09/19/tracing-is-better/ log vs. trace
