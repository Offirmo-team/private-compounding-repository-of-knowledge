/////////////////////////////////////////////////
// better assertions, with design goals:
// - being more semantic
// - alleviating the need to write and maintain assertion messages
// NOTES:
// - trade-off of breaking TS assertion following due to a limitation of TS as of 2026

/////////////////////////////////////////////////

// to report misuse of this lib (not to be confused with the LIB option of assert_from())
const LIBⵧself = "@monorepo-private/assert"

const _assert: AssertFn = (assertion, assertion_description, details = {}, _contextⵧparent = {}) => {
	if (assertion) return

	const context = {
		..._contextⵧparent,
		assertion,
		...(assertion_description && { assertion_description }),
	}
	_on_failure(context, new AssertionFailed(details.statusCode))
}

// https://en.wikipedia.org/wiki/Precondition
// must always be true just prior to the execution of some section of code
// If a precondition is violated, the effect of the section of code becomes undefined and thus may or may not carry out its intended work
const assertⵧpre: AssertFn = (assertion, assertion_description, details = {}, _contextⵧparent = {}) => {
	if (assertion) return

	const context = {
		..._contextⵧparent,
		assertion,
		...(assertion_description && { assertion_description }),
	}
	_on_failure(context, new PreconditionError(details.statusCode))
}

// very common flavor of precondition
const assertⵧparam: AssertFn = (assertion, assertion_description, details = {}, _contextⵧparent = {}) => {
	if (assertion) return

	const context = {
		..._contextⵧparent,
		assertion,
		...(assertion_description && { assertion_description }),
	}
	_on_failure(context, new ArgumentError(details.statusCode))
}

// https://en.wikipedia.org/wiki/Postcondition
// https://en.wikipedia.org/wiki/Java_Modeling_Language#Syntax
// must always be true just after the execution of some section of code
const assertⵧpost: AssertFn = (assertion, assertion_description, details = {}, _contextⵧparent = {}) => {
	if (assertion) return

	const context = {
		..._contextⵧparent,
		assertion,
		...(assertion_description && { assertion_description }),
	}
	_on_failure(context, new PostconditionError(details.statusCode))
}

/////////////////////////////////////////////////

// most recommended usage: auto-builds a clear error message
export function assert_from(fn_in_obj: { [name: string]: Function }, { LIB }: { LIB?: string } = {}) {
	const contextⵧself: Context = { LIB: LIBⵧself, caller__name: "assert_from", object_under_check__name: "fn_in_obj" }
	const [caller__name, caller] = _getꓽsingle_entry(fn_in_obj, contextⵧself)
	assertⵧparam(typeof caller === "function", "should contain a function ex. { my_func }", {}, contextⵧself)

	const contextⵧroot: Context = {
		...(LIB && { LIB }),
		caller,
		caller__name,
	}

	// stateful
	let seenꓽcheck = false // TODO 1D if check() seen, forbid any other kind of assertion
	const issues: Array<ExtendedError> = [] // accumulated as a provision for a future aggregate, not used as of today
	function _check(
		assertion: AssertFnParams[0],
		assertion_description: AssertFnParams[1],
		details: AssertFnParams[2] = {},
		_contextⵧparent: AssertFnParams[3] = {},
	): ExtendedError | undefined {
		seenꓽcheck = true
		if (assertion) return

		const contextⵧsub = {
			..._contextⵧparent,
			assertion,
			...(assertion_description && { assertion_description }),
		}
		const error = _enrich_error(contextⵧsub, new AssertionFailed(details.statusCode))
		issues.push(error)
		return error
	}

	return Object.freeze({
		forⵧparam(value_in_obj: { [name: string]: unknown }) {
			const [object_under_check__name, object_under_check] = _getꓽsingle_entry(value_in_obj, {
				LIB: LIBⵧself,
				caller__name: "forⵧparam",
				object_under_check__name: "value_in_obj",
			})

			const contextⵧsub = {
				...contextⵧroot,
				object_under_check,
				object_under_check__name,
			}

			return Object.freeze({
				require: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => assertⵧparam(assertion, assertion_description, details, contextⵧsub),
				// check is semantically not for param checking = won't use ArgumentError
				// e.g. checking if argument validates some constraints, to be used in type guards = checking the passed object, not doing param check
				check: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => _check(assertion, assertion_description, details, contextⵧsub),
			})
		},
		forⵧvalue(value_in_obj: { [name: string]: unknown }) {
			const [object_under_check__name, object_under_check] = _getꓽsingle_entry(value_in_obj, {
				LIB: LIBⵧself,
				caller__name: "forⵧvalue",
				object_under_check__name: "value_in_obj",
			})

			const contextⵧsub = {
				...contextⵧroot,
				object_under_check,
				object_under_check__name,
			}

			return Object.freeze({
				assert: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => _assert(assertion, assertion_description, details, contextⵧsub),
				ensure: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => assertⵧpost(assertion, assertion_description, details, contextⵧsub),
				check: (
					assertion: AssertFnParams[0],
					assertion_description?: AssertFnParams[1],
					details?: AssertFnParams[2],
				) => _check(assertion, assertion_description, details, contextⵧsub),
			})
		},

		assert: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			_assert(assertion, assertion_description, details, contextⵧroot),
		/*pre: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpre(assertion, assertion_description, details, context),*/
		require: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpre(assertion, assertion_description, details, contextⵧroot),
		/*post: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpost(assertion, assertion_description, details, context),*/
		ensure: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			assertⵧpost(assertion, assertion_description, details, contextⵧroot),

		// WIP
		check: (assertion: AssertFnParams[0], assertion_description?: AssertFnParams[1], details?: AssertFnParams[2]) =>
			_check(assertion, assertion_description, details, contextⵧroot),
		hasꓽissues() {
			return issues.length > 0
		},
		hasꓽno_issues() {
			return issues.length === 0
		},
		assertꓽno_issues() {
			const [first_issue] = issues
			if (first_issue) throw first_issue
		},

		// extremely useful to expose it:
		// - for inspecting when debugging
		// - allows consumer to push into it, e.g. merging 2 checks: ǃ.issues.push(...ǃꓽother(...).issues)
		issues,
	})
}

/////////////////////////////////////////////////

// important for:
// - sugar
// - a direct assert() is needed to solve the TS limitation explained previously
export const assert: AssertSugar = Object.assign(_assert, {
	// extensions
	pre: assertⵧpre,
	post: assertⵧpost,
})

/////////////////////////////////////////////////
// misc

// for switch/case: `default: assertⵧnever_reached({ foo })` with `foo` the switch subject
// - compile time: only accepts `never` → TS errors if a case is not handled
// - runtime (ex. untrusted data, bad cast): reports the unexpected value
// GOTCHA discriminated unions: `{ "shape.kind": shape.kind }` won't compile (shape is `never` = no props)
//        → `assertⵧnever_reached({ shape }, { discriminant: "kind" })` (the discriminant is displayed, NOT the object)
//        BUT if only the prop is a union (ex. `{ mode: "a" | "b" }`), the object never becomes `never`
//        → `assertⵧnever_reached({ "options.mode": options.mode })`
export function assertⵧnever_reached(
	value_in_obj: Record<string, never>,
	{
		discriminant,
		extra_description,
	}: {
		discriminant?: PropertyKey
		extra_description?: string | (() => string)
	} = {},
): never {
	const description = (() => {
		const [value__name, value] = _getꓽsingle_entry(value_in_obj, {
			LIB: LIBⵧself,
			caller__name: "assertⵧnever_reached",
			object_under_check__name: "value_in_obj",
		})
		const value__description = _renderꓽnamed_value(value__name, value, discriminant)

		const description__extra = typeof extra_description === "function" ? extra_description() : extra_description
		if (!description__extra) return value__description

		return `${description__extra} (${value__description})`
	})()

	_on_failure({ assertion: false, assertion_description: description }, new UnreachablePathError())
}

/////////////////////////////////////////////////
// Custom errors helping with assembling the message
class ExtendedError extends Error {
	public readonly message__prefix: string
	public readonly framesToPop: number
	public readonly statusCode: number

	constructor(message__prefix: string, statusCode: number = 500, framesToPop: number = 1) {
		super(`${message__prefix}!`)
		this.message__prefix = message__prefix
		this.name = new.target.name
		this.framesToPop = framesToPop
		this.statusCode = statusCode
	}
}
class AssertionFailed extends ExtendedError {
	constructor(statusCode?: number) {
		super("Assertion failed", statusCode)
	}
}
class PreconditionError extends ExtendedError {
	constructor(statusCode?: number) {
		super("Pre-condition failed", statusCode)
	}
}
class PostconditionError extends ExtendedError {
	constructor(statusCode?: number) {
		super("Post-condition failed", statusCode)
	}
}
class ArgumentError extends ExtendedError {
	constructor(statusCode?: number) {
		super("Invalid argument", statusCode)
	}
}
class UnreachablePathError extends ExtendedError {
	constructor() {
		super("Unreachable branch executed", 500)
	}
}

/////////////////////////////////////////////////

type Context = {
	LIB?: string

	caller?: Function
	caller__name?: string

	object_under_check?: unknown
	object_under_check__name?: string

	assertion?: unknown
	assertion_description?: string | (() => string)
}
interface AssertFn {
	(
		assertion: unknown,
		assertion_description?: string | (() => string),
		details?: { statusCode?: number },
		_contextⵧparent?: Context, // used to pass around the context down the sub-assert tree
	): asserts assertion
}
type AssertFnParams = Parameters<AssertFn>

interface AssertSugar extends AssertFn {
	pre: AssertFn
	post: AssertFn
}

/////////////////////////////////////////////////

function _on_failure(context: Context, error?: ExtendedError): never {
	error = _enrich_error(context, error)

	if (true) {
		// dev mode TODO 1D is PROD?
		console.warn("!!! assertion failed !!!")
		console.warn("!!", error.message)
		console.warn("!!", error)
		console.warn("!! will now throw...") // put breakpoint here
	}

	throw error
}

function _enrich_error(context: Context, error: ExtendedError = new AssertionFailed()): ExtendedError {
	let { LIB, caller__name, object_under_check__name, assertion, assertion_description } = context

	const message__body__assertion = (() => {
		if (typeof assertion_description === "function") assertion_description = assertion_description()

		if (assertion_description) return String(assertion_description)

		// auto detail...

		if (object_under_check__name) {
			object_under_check__name = `assertion about ${object_under_check__name}`
		}

		if (typeof assertion === "boolean") return "should be true"

		if (typeof assertion === "undefined") return "should be defined"

		if (assertion === null) return "should not be null"

		if (assertion === 0) return "should be a non-zero number"
		if (assertion === 0n) return "should be a non-zero BigInt"

		if (assertion === "") return "should be a non-empty string"

		if (Number.isNaN(assertion)) return "should not be NaN"

		return "should be truthy"
	})()

	const message__body = [
		...(LIB ? [`[${LIB}]`] : []),
		...(caller__name ? [`${caller__name}():`] : []),
		`${error!.message__prefix}:`,
		...(object_under_check__name ? [`${object_under_check__name}`] : []),
		message__body__assertion,
	]

	let messageⵧfinal = message__body.join(" ")
	if (!messageⵧfinal.endsWith("!")) messageⵧfinal += "!"

	error!.message = messageⵧfinal

	return error
}

// our APIs take a { name: value } object to capture both the name and the value
function _getꓽsingle_entry(value_in_obj: unknown, context: Context): [string, unknown] {
	assertⵧparam(
		typeof value_in_obj === "object" && value_in_obj !== null,
		"should be an object ex. { foo }",
		{},
		context,
	)

	const entries = Object.entries(value_in_obj)
	const [entry] = entries
	assertⵧparam(
		entry && entries.length === 1,
		() => `should have exactly 1 entry ex. { foo }, got ${entries.length}`,
		{},
		context,
	)

	return entry
}

function _renderꓽnamed_value(name: string, value: unknown, discriminant?: PropertyKey): string {
	if (discriminant === undefined || typeof value !== "object" || value === null)
		return `${name} = ${_renderꓽvalue(value)}`

	const accessor = typeof discriminant === "string" ? `.${discriminant}` : `[${String(discriminant)}]`
	return `${name}${accessor} = ${_renderꓽvalue((value as Record<PropertyKey, unknown>)[discriminant])}`
}

// objects are NOT rendered: risk of leaking sensitive data / huge or circular payloads
// strings are JSON-encoded: unambiguous + escapes control chars (log injection)
function _renderꓽvalue(value: unknown): string {
	if (value === null) return "null"
	if (typeof value === "object" || typeof value === "function") return `<${typeof value}>`
	if (typeof value === "string") return JSON.stringify(value)
	if (typeof value === "bigint") return `${value}n`

	return String(value) // undefined, number, boolean, symbol
}
////////////////////////////////////////////////
