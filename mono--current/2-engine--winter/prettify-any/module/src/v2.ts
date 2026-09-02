import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽoptionsⵧfull } from "./options.ts"
import type { Options, State } from "./types.ts"

/////////////////////////////////////////////////

function _createꓽstate(options: Options): State {
	const o = getꓽoptionsⵧfull(options)

	return {
		o,

		indent_string: new Array(o.indent_size‿charcount).fill(" ").join(""),
		indent_levelⵧcurrent: 0,
		remaining_width‿charcount: o.max_width‿charcount,
		indent_levelⵧmax: 0,
		isꓽjson: true, // so far

		circular: new WeakSet<object>(),
	}
}

function prettifyꓽany(js: Immutable<any>, options: Immutable<Partial<Options>> = {}): string {
	try {
		const st = _createꓽstate(getꓽoptionsⵧfull(options))

		let result = st.o.prettifyꓽany(js, st).join(st.o.eol)
		//console.log('max indent', st.indent_levelⵧmax)

		// backtrack if too big
		if (st.o.eol && st.indent_levelⵧmax * st.o.indent_size‿charcount > st.o.max_width‿charcount) {
			// the object is too deep and cause unwanted multi line display. Can we ease it by reducing the indentation size?
			const ideal_indent_size‿charcount = Math.max(1, Math.floor(st.o.max_width‿charcount / st.indent_levelⵧmax))
			if (ideal_indent_size‿charcount < st.o.indent_size‿charcount) {
				// re-display with reduced indent
				//console.warn('backtrack', ideal_indent_size‿charcount)
				options = {
					...options,
					indent_size‿charcount: ideal_indent_size‿charcount,
				}
				const st = _createꓽstate(getꓽoptionsⵧfull(options))
				result = st.o.prettifyꓽany(js, st).join(st.o.eol)
			}
		}

		if (!st.isꓽjson && st.o.should_warn_not_json) {
			result += " " + st.o.stylizeꓽerror("[NOT JSON!]")
		}

		return result
	} catch (err) {
		if (options?.can_throw) throw err

		return `[error prettifying:${(err as any)?.message}]`
	}
}

function prettifyꓽjson(js: Immutable<any>, options: Immutable<Partial<Options>> = {}): string {
	options = {
		...options,
		should_warn_not_json: true, // forced
	}

	return prettifyꓽany(js, options)
}

function dumpꓽanyⵧprettified(msg: string, data: Immutable<any>, options: Immutable<Partial<Options>> = {}): void {
	console.log(msg)
	console.log(prettifyꓽany(data, options))
}

/* TODO one day
export function is_pure_json(js: Immutable<any>): boolean {
	return false
}
*/

/////////////////////////////////////////////////

export { prettifyꓽany, prettifyꓽjson, dumpꓽanyⵧprettified }
