import type { XError, XXError } from "./types.ts"

/////////////////////////////////////////////////

// order is important!
// it may be used for display by other libs

const STRICT_STANDARD_ERROR_FIELDS = new Set<keyof XError>([
	// standard fields
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	"name", // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name
	"message", // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message
	"cause", // ES2022 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
	// see also https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#lib-d-ts-updates
])

const QUASI_STANDARD_ERROR_FIELDS = new Set<keyof XError>([
	// first inherit from previous
	...STRICT_STANDARD_ERROR_FIELDS,

	// quasi-standard: followed by all browsers + node
	// being standardized: https://github.com/tc39/proposal-error-stack-accessor
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
	// see also https://v8.dev/docs/stack-trace-api
	"stack", // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack

	// ES2024
	// already supported in TypeScript https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#using-declarations-and-explicit-resource-management
	"suppressed",
])

const COMMON_ERROR_FIELDS = new Set<keyof XError>([
	// first inherit from previous
	...QUASI_STANDARD_ERROR_FIELDS,

	// standard in node only:
	"code", // https://medium.com/the-node-js-collection/node-js-errors-changes-you-need-to-know-about-dc8c82417f65
	// https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes

	// standard in Firefox only for AggregateError:
	"errors", // https://devdocs.io/javascript/global_objects/aggregateerror

	// non-standard but widely used:
	"statusCode", // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
	"shouldRedirect", // express, https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
	"framesToPop", // see facebook https://github.com/facebook/flux/blob/2.0.2/src/invariant.js
])

// TODO node has a lot of other fields https://nodejs.org/api/errors.html

const COMMON_ERROR_FIELDS_EXTENDED = new Set<keyof XXError>([
	// first inherit from previous
	...COMMON_ERROR_FIELDS,

	// TODO review
	// My (Offirmo) extensions:
	"_temp", // used for passing state around during error handling
	"details", // hash to store any other property not defined in this set

	// TODO evaluate if need arises:
	// - triage field?
	// - timestamp?
])

/////////////////////////////////////////////////

export { STRICT_STANDARD_ERROR_FIELDS, QUASI_STANDARD_ERROR_FIELDS, COMMON_ERROR_FIELDS, COMMON_ERROR_FIELDS_EXTENDED }

// TODO TRPCError
