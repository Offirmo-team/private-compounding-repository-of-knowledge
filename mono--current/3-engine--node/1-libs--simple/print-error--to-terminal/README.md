## Improved display of an error on a terminal

The terminal (node.js) lacks the observability of the browser's console. The default error display (console) is inferior
and hard to detect + parse.

This lib solves all the issues ✅

- all fields are displayed
- "details" are displayed
- "cause" is displayed
- the stack is cleaned with 1) framesToPop 2) first useless line

Note:

- this lib relies on `@monorepo-private/utils--error` but is separated since specific to node.js / terminal
- this lib occusionally adds content not present on the error object. Such content is denoted by special brackets:
  `⟨...⟩`

Roadmap

- TODO MAYBE? improve stack display with https://www.stacktracejs.com/
- TODO use util.getSystemErrorName(err) https://nodejs.org/api/util.html#utilgetsystemerrornameerr
