# soft-execution-context

A fresh take on asynchronous contexts for node and browser. Inspired by zone.js and node domains.

Because I desperately need that for personal projects.

WORK IN PROGRESS, COMPLETELY EXPERIMENTAL FOR NOW

2024/04 Turns out it's already a thing in telemetry:

- "A Context is an object that contains the information for the sending and receiving service (or execution unit) to
  correlate one signal with another." https://opentelemetry.io/docs/concepts/context-propagation/
- Propagation is the mechanism that moves context between services and processes.

Also "WorkContext" store data that is needed for the lifetime of a request, but should be discarded when the request
exits. The usage of the data can span thread boundaries, for example, by using a Future or parallel streams.

MVP v2 - 2018/05

TODO remove full logger

## Introduction

Note: "Soft Execution Context" is abbreviated SXC everywhere.

Objectives:

- isomorphic, for node and browser
- reliably catch errors
  - either in a correctly chained path
  - or in any async path
- clear and exploitable errors
  - with an exploitable stack
  - with details
- basic dependency injection (DI), sort of React context
- can bubble events
  - ex. analytics can enrich details
- can abort a whole process and have a fallback
- not too slow (lots of forks)

BE DEFENSIVE !!!

## API

### Concepts

#### Hierarchy

Each SXC is linked to a parent, forming a graph.

Thus, a SXC is usually created from a parent with `parentSXC.createChild()`.

There is always a unique (singleton) top SXC. It is lazily created on call of `getRootSXC()`.

However, this root SXC can be customized like any other SXC.

### requisites

babel-polyfill may be needed? TODO check

### Methods

```js

SXC.injectDependencies({
	foo: 42,
})
const { ENV, SXC, logger, foo } = SXC.getInjectedDependencies()

/// SYNCHRONOUS
// won't catch
SXC.xTry(operation, ({SXC, logger}) => {
	...
})
// !! will auto-catch, be careful!! (ex. used at top level)
SXC.xTryCatch(...)


/// ASYNCHRONOUS
// classic Promise.try
return await SXC.xPromiseTry(operation, async ({SXC, logger}) => {
	...
})
// !! will auto-catch, be careful!!
SXC.xPromiseCatch(operation, promise)
SXC.xPromiseTryCatch(...)



SXC.setLogicalStack({
	module: LIB,
	operation: ...
})

SXC.getLogicalStack()
SXC.getShortLogicalStack()

SXC.emitter.emit('analytics', { SXC, eventId, details })
```

### Injections

| value                   | Injected | Analytics | Error context | notes                                                                                                                |
| ----------------------- | -------- | --------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `SXC`                   | yes✅    | -         | -             | the current Software Execution Context                                                                               |
| `logger`                | yes✅    | -         | -             | default to console                                                                                                   |
| `ENV`                   | yes✅    | yes✅     | yes✅         | less connoted alias of `NODE_ENV` 😉                                                                                 |
| `IS_DEV_MODE`           | yes✅    | -         | -             | default to `false`. Used to activate dev commands or reportings, ex. extra settings, extra UI                        |
| `IS_VERBOSE`            | yes✅    | -         | -             | default to `false`. Used to activate extra reporting on tasks, intent like --verbose                                 |
| `CHANNEL`               | yes✅    | yes✅     | yes✅         | current channel of rollout deployment. Default to `'dev'`. Suggested possible values: `'dev'`, `'staging'`, `'prod'` |
| `SESSION_START_TIME_MS` | yes✅    | -         | -             | UTC timestamp in ms of the time of start                                                                             |
| `TIME`                  | -        | yes✅     | yes✅         | UTC timestamp in ms of the time of the error/analytics                                                               |
| `SESSION_DURATION_MS`   | -        | yes✅     | yes✅         | ms elapsed from the start of the session                                                                             |
| `OS_NAME`               | yes✅\*  | yes✅\*   | yes✅\*       | (Expected to be set by platform-specific code)                                                                       |
| `DEVICE_UUID`           | -        | yes✅\*   | yes✅\*       | (Expected to be set by platform-specific code)                                                                       |
| `VERSION`               | -        | yes✅\*   | yes✅\*       | (Expected to be set by the user)                                                                                     |
| `?`                     | -        | -         | -             |                                                                                                                      |

### Event emitter

All SXC are sharing a common event emitter. Please do NOT abuse!

DO NOT EMIT SXC events, it's usually not what you want to do.

Events:

- `final-error`: an error than no SXC can handle or mitigate (usually a crash). This event should be listened to by
  final reporters, like Sentry, or to display a crash report.

### internals

```
{
	sid: number
	parent: parent_state || null
	plugins: {
		dependency_injection: {
			context: {  -> prototypically inherited <-
				...
				logger = console
				ENV = NODE_ENV || 'development'
				DEBUG = false // TOREVIEW
			}
		},
		error_handling: {
			details: {  -> prototypically inherited <-
				...
			},
		},
		logical_stack: {
			stack: {  -> prototypically inherited <-
				module: ...
				operation: ...
			}
		},
	},
	cache: { // per-SXC cache for complex computations
	},
}

```

```js
SXC._decorateErrorWithDetails(err)
SXC._decorateErrorWithLogicalStack(err)

flattenToOwn(object)
_flattenSXC(SXC)
_getSXCStatePath(SXC)
```

### Contributing

Do NOT assume that there is an advanced logger! Only use the "console safe" ones
