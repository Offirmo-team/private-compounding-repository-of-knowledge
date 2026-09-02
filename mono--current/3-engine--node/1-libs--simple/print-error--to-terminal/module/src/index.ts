/* eslint-disable no-console */
import chalk from "chalk"

import { COMMON_ERROR_FIELDS_EXTENDED } from "@monorepo-private/utils--error"

interface Context {
	// params
	line_separator: string
	shouldꓽuse_escape_codes: boolean
	//cause_chain_limit: number TODO implement
	visual_marker: string

	// processing state
	seen_errors: Set<any> // to avoid infinite loops when displaying "cause"
}

function _apply_styleⵧred(context: Context, s: string): string {
	if (context.shouldꓽuse_escape_codes) return chalk.red(s)
	return s
}
function _apply_styleⵧbold(context: Context, s: string): string {
	if (context.shouldꓽuse_escape_codes) return chalk.bold(s)
	return s
}
function _apply_styleⵧdim(context: Context, s: string): string {
	if (context.shouldꓽuse_escape_codes) return chalk.dim(s)
	return s
}

function _propertyⵧraw_to_string(context: Context, errLike: Readonly<any>, prop: string): string[] {
	return [_apply_styleⵧdim(context, ` ${prop}: "`) + errLike[prop] + _apply_styleⵧdim(context, '"')]
}

function _propertyⵧcause_to_string(context: Context, errLike: Readonly<any>, prop: string = "cause"): string[] {
	const cause_err = errLike[prop]
	if (context.seen_errors.has(cause_err)) return [_apply_styleⵧdim(context, " cause: ⟨CIRCULAR REFERENCE!!⟩")]
	context.seen_errors.add(cause_err)

	return [
		" cause:",
		...error_to_string(cause_err, context)
			.split(context.line_separator)
			.map((line) => " " + line),
	].map((line) => _apply_styleⵧdim(context, line))
}

function _propertyⵧstack_to_string(context: Context, errLike: Readonly<any>, prop: string = "stack"): string[] {
	const stack__raw = errLike[prop]

	if (typeof stack__raw !== "string") return _propertyⵧraw_to_string(context, errLike, prop)

	// TODO add optional support of https://github.com/stacktracejs/error-stack-parser
	const lines = stack__raw
		.split(context.line_separator)
		.filter((line) => !line.startsWith(errLike["name"] || "Error:"))
		.map((line) => line.trim())

	const ftp = Number.parseInt(errLike["framesToPop"])
	if (ftp > 0) {
		if (ftp !== errLike["framesToPop"] || ftp >= lines.length) {
			lines.splice(0, 0, `⟨framesToPop: ${ftp}???⟩`)
		} else {
			const ftp_line = _apply_styleⵧdim(context, `⟨frames popped: ${ftp}⟩`)
			lines.splice(0, Math.max(ftp, lines.length - 1), ftp_line)
		}
	}

	return lines.map((line) => _apply_styleⵧdim(context, " ↳ ") + line)
}

function _error_prop_to_string(context: Context, errLike: Readonly<any>, prop: string): string[] {
	let lines = [] as string[]

	switch (prop) {
		case "details": {
			const details: { [key: string]: any } = errLike["details"]
			lines.push(_apply_styleⵧdim(context, ` ${prop}:`))

			Object.entries(details).forEach(([key, value]) => {
				lines.push(_apply_styleⵧdim(context, `   ${key}: "`) + value + _apply_styleⵧdim(context, '"'))
			})
			break
		}

		case "stack":
			lines.push(..._propertyⵧstack_to_string(context, errLike))
			break

		case "cause":
			lines.push(..._propertyⵧcause_to_string(context, errLike))
			break

		default: {
			lines.push(..._propertyⵧraw_to_string(context, errLike, prop))
			break
		}
	}

	return lines
}

function error_to_string(
	errLike: Readonly<Partial<Error>>,
	context: Context = {
		shouldꓽuse_escape_codes: true,
		line_separator: (new Error("test").stack?.split("\r\n")?.length || 1) > 1 ? "\r\n" : "\n",
		//cause_chain_limit: -1,
		visual_marker: "❗", // 🔥🔥🔥🔥🔥🔥🔥 ❗
		seen_errors: new Set(),
	},
): string {
	context.seen_errors.add(errLike)

	let lines = [] as string[]

	lines.push(
		[
			context.visual_marker,
			errLike.name?.toLowerCase().includes("error") ? "" : "⟨Error⟩",
			_apply_styleⵧbold(context, errLike.name || "⟨unnamed??⟩"),
			context.visual_marker,
		]
			.map((s) => s.trim())
			.filter((s) => !!s)
			.join(" "),
	)

	// We don't use normalizeError() from @monorepo-private/utils--error
	// on the ground that a well-defined error wiring
	// should already have used it.

	const displayedProps = new Set()
	displayedProps.add("name") // already displayed as the title
	if (errLike.stack) displayedProps.add("framesToPop") // will be displayed as part of the stack

	if (errLike.message) {
		lines.push(..._error_prop_to_string(context, errLike, "message"))
		displayedProps.add("message")
	}
	if ((errLike as any).details) {
		lines.push(..._error_prop_to_string(context, errLike, "details"))
		displayedProps.add("details")
	}

	;[
		...Array.from(COMMON_ERROR_FIELDS_EXTENDED).filter((prop) => prop !== "stack" && prop !== "cause"), // we'll display them after for ordering reason
		"stack",
		"cause",
	].forEach((prop) => {
		if (prop in errLike && !displayedProps.has(prop)) {
			lines.push(..._error_prop_to_string(context, errLike, prop))
			displayedProps.add(prop)
		}
	})

	lines.push(context.visual_marker)

	lines = lines.map((line, index) => {
		if (index === 0) return "┏━" + line
		if (index === lines.length - 1) return "┗━" + line
		return "┃" + line
	})
	return _apply_styleⵧred(context, lines.join(context.line_separator))
}

///////////////////////////////

function displayError(errLike: Readonly<Partial<Error>> = {}) {
	console.error(error_to_string(errLike))
}

export { displayError, error_to_string }
