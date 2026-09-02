import { isꓽnegative_zero } from "./__vendor/@monorepo-private/type-detection/index.ts"
import type { PrettifyOptions, State } from "./types.ts"
import { cmp } from "./utils.ts"

/////////////////////////////////////////////////

function _set_monoline(st: State): State {
	if (!st.o.eol) return st // already monoline

	return {
		...st,
		o: {
			...st.o,
			eol: "",
			indent_size‿charcount: 0,
		},
		indent_string: "",
	}
}

function _increase_indentation(st: State): State {
	return {
		...st,
		indent_levelⵧcurrent: st.indent_levelⵧcurrent + 1,
		remaining_width‿charcount: st.remaining_width‿charcount - st.o.indent_size‿charcount,
		indent_levelⵧmax: Math.max(st.indent_levelⵧmax, st.indent_levelⵧcurrent + 1),
	}
}

const DEBUG = false
const OPTIONS__PRETTIFYⵧDEFAULT: PrettifyOptions = {
	can_throw: false, // common usage is to debug, we need to always work

	// primitives, in order of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values
	prettifyꓽnull: (st: State) => {
		if (DEBUG) console.log("prettifyꓽnull")
		const { o } = st
		return o.stylizeꓽprimitive("null")
	},
	prettifyꓽundefined: (u: undefined, st: State) => {
		const { o } = st
		return o.stylizeꓽsuspicious(String(u))
	},
	prettifyꓽboolean: (b: boolean, st: State) => {
		const { o } = st
		return o.stylizeꓽprimitive(String(b))
	},
	prettifyꓽnumber: (n: number, st: State) => {
		const { o } = st
		if (o.should_recognize_constants) {
			switch (n) {
				case Number.EPSILON:
					return o.stylizeꓽglobal("Number.EPSILON")
				case Number.MAX_VALUE:
					return o.stylizeꓽglobal("Number.MAX_VALUE")
				case Number.MIN_VALUE:
					return o.stylizeꓽglobal("Number.MIN_VALUE")
				case Number.MAX_SAFE_INTEGER:
					return o.stylizeꓽglobal("Number.MAX_SAFE_INTEGER")
				case Number.MIN_SAFE_INTEGER:
					return o.stylizeꓽglobal("Number.MIN_SAFE_INTEGER")

				case Math.PI:
					return o.stylizeꓽglobal("Math.PI")
				case Math.E:
					return o.stylizeꓽglobal("Math.E")
				// no more Math, seldom used

				default:
				// fallback
			}
		}

		// https://mailarchive.ietf.org/arch/msg/json/RRT0jWUruScN1oXlgZlTqETivSU/
		if (!isFinite(n) || isꓽnegative_zero(n)) st.isꓽjson = false

		return !isFinite(n) // REM: covers NaN and +-Infinity
			? o.stylizeꓽerror(String(n))
			: isꓽnegative_zero(n)
				? o.stylizeꓽerror("-0")
				: o.stylizeꓽprimitive(String(n))
	},
	prettifyꓽbigint: (b: bigint, st: State) => {
		st.isꓽjson = false
		const { o } = st
		return o.stylizeꓽprimitive(String(b) + "n")
	},
	prettifyꓽstring: (s: string, st: State) => {
		const { o } = st
		return o.stylizeꓽdim(o.quote) + o.stylizeꓽuser(s) + o.stylizeꓽdim(o.quote)
	},
	prettifyꓽsymbol: (s: symbol, st: State) => {
		st.isꓽjson = false
		const { o } = st
		try {
			return (
				"" +
				o.stylizeꓽglobal("Symbol") +
				o.stylizeꓽsyntax("(") +
				(s.description ? o.prettifyꓽstring(s.description, st) : "") +
				o.stylizeꓽsyntax(")")
			)
		} catch (err) {
			return o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/ps]`)
		}
	},

	// "objects"
	prettifyꓽfunction: (f: Function, st: State, { as_prop = false } = {}) => {
		st.isꓽjson = false
		const { o } = st

		if (f.name && (globalThis as any)[f.name] === f) {
			return o.stylizeꓽuser(f.name)
		}

		let result = ""

		if (f.name) {
			if (!as_prop) {
				// class detection may not work with Babel
				result += o.stylizeꓽsyntax(f.toString().startsWith("class ") ? "class " : "function ")
			}

			result += o.stylizeꓽuser(f.name)
		}

		result += o.stylizeꓽsyntax("()")
		result += o.stylizeꓽsyntax(f.name ? " " : " => ")
		result += o.stylizeꓽsyntax("{")
		result += o.stylizeꓽdim("\/\*…\*\/")
		result += o.stylizeꓽsyntax("}")

		return result
	},
	prettifyꓽarray: (a: Array<any>, st: State) => {
		if (DEBUG) console.log("prettifyꓽarray", a)
		const parent_state = st // for passing infos up
		st = _set_monoline(st)
		st = {
			...st,
			circular: new Set([...Array.from(st.circular as any), a]),
		}
		const { o } = st

		const elements = a
			// NOTE when fully empty, map won't execute (but it looks nice, no pb)
			.map((e) => o.prettifyꓽany(e, st))
			.map((lines) => lines.join(""))

		parent_state.isꓽjson = parent_state.isꓽjson && st.isꓽjson

		// TODO MULTI LINE
		return [o.stylizeꓽsyntax("[") + elements.join(o.stylizeꓽsyntax(",")) + o.stylizeꓽsyntax("]")]
	},
	prettifyꓽobjectⵧkeyⳇvalue: (obj: Object, st: State): string[] => {
		if (DEBUG) console.log("prettifyꓽobjectⵧkeyⳇvalue", obj)
		let { o } = st

		try {
			const keys = Reflect.ownKeys(obj)

			if (o.should_sort_keys)
				keys.sort((a: string | number | symbol, b: string | number | symbol) => {
					let res = cmp(typeof a, typeof b)

					if (res === 0) {
						res = cmp(a, b)
					}

					return res
				})

			const parent_state = st // for passing infos up
			st = _increase_indentation(st)
			st = {
				...st,
				circular: new Set([...Array.from(st.circular as any), obj]),
			}

			//const trailing_comma = '⧼' + o.stylizeꓽsyntax(',') + '⧽' // debug
			const trailing_comma = o.stylizeꓽsyntax(",")
			let kvs: string[][] = keys.map((k): string[] => {
				const v = (obj as any)[k]

				if (typeof v === "function" && v.name === k) {
					// special display
					return [o.prettifyꓽfunction(v, st, { as_prop: true })]
				}

				const key = o.prettifyꓽproperty__name(k, st)
				let sub_lines = o.prettifyꓽany(v, st)

				/*
				const max_remaining_length‿charcount = o.max_width‿charcount - st.indent_levelⵧcurrent * o.indent_size‿charcount - toꓽstringⵧwithout_ansi(key).length - 1
				if (toꓽstringⵧwithout_ansi(sub_lines.join(',')).length < max_remaining_length‿charcount) {
					// coerce into a single line
					sub_lines = [
						sub_lines.join(', '),
					]
				}
*/

				return [key + o.stylizeꓽsyntax(": ") + sub_lines[0], ...sub_lines.slice(1)]
			})

			if (keys.length > 1) {
				// separate the entries with commas
				// TODO one day trailing comma, but only if multi-line
				kvs = [
					...kvs.slice(0, -1).map((sub_lines) => {
						return [...sub_lines.slice(0, -1), ...sub_lines.slice(-1).map((s) => s + trailing_comma)]
					}),
					...kvs.slice(-1),
				]
			}
			let lines: string[] = kvs.flat()

			// pass some infos up
			parent_state.indent_levelⵧmax = Math.max(parent_state.indent_levelⵧmax, st.indent_levelⵧmax)
			parent_state.isꓽjson = parent_state.isꓽjson && st.isꓽjson

			// compact the representation if appropriate
			let should_compact_to_single_line: boolean =
				!o.eol ||
				(() => {
					if (!o.should_compact_objects) return false

					if (keys.length <= 1) return true

					// TODO compact on small objects

					return false
				})()

			let final_lines = [o.stylizeꓽsyntax("{"), ...lines, o.stylizeꓽsyntax("}")]

			if (should_compact_to_single_line) {
				return [final_lines.join("")]
			}

			// indent
			final_lines = [
				final_lines[0]!,
				...final_lines.slice(1, -1).map((s) => st.indent_string + s),
				...final_lines.slice(-1),
			]

			return final_lines
		} catch (err) {
			return [o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/po--kv]`)]
		}
	},
	prettifyꓽobject: (obj: Object, st: State, { display_constructor = true } = {}): string[] => {
		if (DEBUG) console.log("prettifyꓽobject", obj)
		let { o } = st

		try {
			if (o.should_recognize_globals) {
				try {
					switch (obj) {
						case globalThis:
							st.isꓽjson = false
							return [o.stylizeꓽglobal("globalThis")]

						// @ts-expect-error TS7029
						case (globalThis as any).process?.env:
							o = {
								...o,
								should_sort_keys: true, // force for this object
							}
						// fallthrough

						default:
						// fallback
					}
				} catch (err) {
					return [o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/po.g]`)]
				}
			}

			if (display_constructor) {
				try {
					const proto = Object.getPrototypeOf(obj)
					if (proto && proto.constructor && proto.constructor.name) {
						if (proto.constructor !== Object) {
							st.isꓽjson = false
							return [
								o.stylizeꓽsyntax("new ") +
									((globalThis as any)[proto.constructor.name] === proto.constructor
										? o.stylizeꓽglobal(proto.constructor.name)
										: o.stylizeꓽuser(proto.constructor.name)) +
									o.stylizeꓽsyntax("(") +
									(() => {
										switch (proto.constructor.name) {
											// all primitives that can be an Object
											case "String":
												return o.prettifyꓽstring(obj as string, st)
											case "Number":
												return o.prettifyꓽnumber(obj as number, st)
											case "Boolean":
												return o.prettifyꓽboolean(obj as boolean, st)

											// recognize some objects
											case "Set":
												return o.prettifyꓽarray(Array.from((obj as Set<any>).keys()), st)
											case "WeakSet":
												return o.stylizeꓽdim("/\*not enumerable*\/")
											case "Date":
												return o.stylizeꓽdim(`/*${(obj as any)[o.date_serialization_fn]()}*/`)

											// node
											case "Buffer":
												// too big!
												return "/*…*/"
											case "Gunzip": // seen in fetch_ponyfill response
												// too big!
												return "/*…*/"

											// other
											default:
												if (proto.constructor.name.endsWith("Error")) {
													const err: Error = obj as any
													// no need to pretty print it as copy/pastable to code,
													// 99.9% chance that's not what we want here
													return o.stylizeꓽerror(o.quote + err.message + o.quote)
												}

												// Beware! This can turn into a huge thing, ex. a fetch response
												// REM we MUST NOT have display_constructor = true to avoid infinite loops
												return o.prettifyꓽobject(obj, st, { display_constructor: false })
											//return '/*…*/'
										}
									})() +
									o.stylizeꓽsyntax(")"),
							]
						}
					}
				} catch (err) {
					return [o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/po.c]`)]
				}
			}
		} catch (err) {
			return [o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/po]`)]
		}

		return o.prettifyꓽobjectⵧkeyⳇvalue(obj, st)
	},

	// utils
	prettifyꓽproperty__name: (p: string | number | symbol, st: State) => {
		const { o } = st

		try {
			// TODO change color
			switch (typeof p) {
				case "number":
					return o.prettifyꓽnumber(p, st)
				case "string": {
					// TODO use quotes only if needed
					// https://mathiasbynens.be/notes/javascript-properties
					return o.prettifyꓽstring(p, st)
				}
				case "symbol":
					return o.stylizeꓽsyntax("[") + o.prettifyꓽsymbol(p, st) + o.stylizeꓽsyntax("]")
			}
		} catch (err) {
			return o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/ppn]`)
		}
	},

	// root
	prettifyꓽany(any: any, st: State): string[] {
		if (DEBUG) console.log("prettifyꓽany", any)
		const { o } = st

		try {
			switch (typeof any) {
				/////// primitive type ///////
				case "string":
					return [o.prettifyꓽstring(any, st)]
				case "number":
					return [o.prettifyꓽnumber(any, st)]
				case "bigint":
					return [o.prettifyꓽbigint(any, st)]
				case "boolean":
					return [o.prettifyꓽboolean(any, st)]
				case "undefined":
					return [o.prettifyꓽundefined(any, st)]
				case "symbol":
					return [o.prettifyꓽsymbol(any, st)]

				/////// non-primitive type ///////
				case "function": // special sub-type of object
					return [o.prettifyꓽfunction(any, st)]
				case "object": {
					// we pre-filter some objects flavour
					// it's a design decision,
					// it allows for more efficient overloads via custom options

					if (any === null) return [o.prettifyꓽnull(st)]

					if (st.circular.has(any)) {
						st.isꓽjson = false
						return Array.isArray(any)
							? [o.stylizeꓽerror("[<Circular ref!>]")]
							: [o.stylizeꓽerror("{<Circular ref!>}")]
					}

					if (Array.isArray(any)) return o.prettifyꓽarray(any, st)

					return o.prettifyꓽobject(any, st)
				}

				default:
					return [`[unsupported type:${typeof any}]`]
			}
		} catch (err) {
			return [o.stylizeꓽerror(`[error prettifying:${(err as any)?.message}/pa]`)]
		}
	},
}

/////////////////////////////////////////////////

export { OPTIONS__PRETTIFYⵧDEFAULT }
