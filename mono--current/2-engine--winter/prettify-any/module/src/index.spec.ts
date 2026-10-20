import * as util from "node:util"

import chalk from "chalk"
import { render as prettyjson } from "prettyjson"
import getꓽterminal_size from "terminal-size"
//import { injectꓽlibꓽchalk } from './injectable-lib--chalk.ts'
//injectꓽlibꓽchalk(chalk as any)

import { getꓽstylize_optionsⵧterminal } from "./options--stylize--terminal.ts"
import { prettifyꓽany as _prettify_any } from "./v2.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/prettify-any", function () {
	const should_test_verbose = false

	describe("prettifyꓽany()", function () {
		const stylizeꓽerror = getꓽstylize_optionsⵧterminal(chalk).stylizeꓽerror
		function prettifyꓽany(...args: Parameters<typeof _prettify_any>) {
			const prettified = _prettify_any(...args)
			if (prettified.startsWith("[error prettifying:")) throw new Error(prettified)
			return prettified
		}
		function test_to_console(value: any): void {
			console.log("≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡")
			console.log("☑ console.log    :", value)
			console.log("☑ console.dir    :")
			console.dir(value)
			console.log(
				"☑ util.inspect   :",
				util.inspect(value, {
					depth: Infinity,
					colors: true,
					maxArrayLength: Infinity,
					breakLength: getꓽterminal_size().columns,
					compact: true,
				}),
			)
			console.log(
				"☐ .toString      :",
				(() => {
					try {
						return String(value)
					} catch (err) {
						return stylizeꓽerror(`<.toString error! "${(err as any)?.message}">`)
					}
				})(),
			)
			console.log(
				"☐ JSON.stringify :",
				(() => {
					try {
						return JSON.stringify(value)
					} catch (err) {
						return stylizeꓽerror(`<JSON.stringify error! "${(err as any)?.message}">`)
					}
				})(),
			)
			console.log(
				"☐ prettyjson     :",
				(() => {
					try {
						return prettyjson(value)
					} catch (err) {
						return stylizeꓽerror(`<prettyjson error! "${(err as any)?.message}">`)
					}
				})(),
			)
			console.log(
				chalk.bold.greenBright("☐ prettifyꓽany(…):"),
				prettifyꓽany(value, { can_throw: true, should_warn_not_json: true }),
			)
		}

		describe("handling of primitive type/values", function () {
			// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
			// string, number, bigint, boolean, undefined, and symbol

			it("should work with a single primitive -- string", () => {
				test_to_console("foo")
				test_to_console("42")
				test_to_console("")
			})

			it("should work with a single primitive -- number", () => {
				test_to_console(42)
				test_to_console(0.05)
				test_to_console(0)
				test_to_console(-0)
				test_to_console(0.0)
				test_to_console(-1 / 3)
				test_to_console(NaN)
				test_to_console(+Infinity)
				test_to_console(-Infinity)
				test_to_console(Math.PI)
				test_to_console(Math.E)
				test_to_console(Number.EPSILON)
				test_to_console(Number.MAX_VALUE)
				test_to_console(Number.MIN_VALUE)
				test_to_console(Number.MAX_SAFE_INTEGER)
				test_to_console(Number.MIN_SAFE_INTEGER)
				test_to_console(0xdeadbeef)
				test_to_console(0b1001)
				test_to_console(0.12e3)
			})

			it("should work with a single primitive -- bigint", () => {
				test_to_console(9007199254740991n)
				test_to_console(BigInt(Number.MAX_SAFE_INTEGER))
			})

			it("should work with a single primitive -- boolean", () => {
				test_to_console(true)
				test_to_console(false)
			})

			it("should work with a single primitive -- undefined", () => {
				test_to_console(undefined)
			})

			it("should work with a single primitive -- symbol", () => {
				let sym1 = Symbol()
				let sym2 = Symbol("key")
				let sym3 = Symbol("key")
				let sym4 = Symbol.for("nodejs.util.inspect.custom")

				test_to_console(sym1)
				test_to_console(sym2)
				test_to_console(sym3)
				test_to_console(sym4)
			})

			describe("null", function () {
				it("should work", () => {
					test_to_console(null)
				})
			})
		})

		describe("handling of non-primitive type/values", function () {
			describe("arrays", function () {
				it("should work -- tuple -- 0", () => {
					test_to_console([])
				})

				context("with elements being primitive types", function () {
					it("should work -- tuple -- 1", () => {
						test_to_console(["foo"])
					})

					it("should work -- tuple -- 2", () => {
						test_to_console(["foo", "bar"])
					})

					it("should work -- assortment", () => {
						test_to_console(["foo", "bar", 42, Symbol("key")])
					})
				})

				context("with elements being non-primitive types", function () {
					it("should work -- simple", () => {
						test_to_console([{ foo: "bar" }])
					})

					it("should work -- assortment", () => {
						test_to_console([() => {}, { foo: "bar" }])
					})
				})

				it("should work -- depth", () => {
					test_to_console([[0], [1, 2]])
				})

				it("should work -- holes", () => {
					test_to_console(new Array(5))
					const a = new Array(5)
					a[3] = 3
					test_to_console(a)
				})

				it("should work -- repeated references (NOT circular)", () => {
					const r: any = { foo: "42" }
					const a = [r, r]
					test_to_console(a)
				})

				it("should work -- circular references", () => {
					const a: any[] = []
					a.push(a)
					test_to_console(a)
				})
			})

			describe("objects/hashes", function () {
				it("should work -- trivial object", () => {
					test_to_console({ foo: 42 })
				})

				it("should work -- attributes of primitive types  (key + value)", () => {
					test_to_console({
						k: undefined,
						23: null,
						[Symbol("key")]: "bar",
						x: 42,
					})
				})

				it("should work -- attributes of non-primitive types  (key + value)", () => {
					test_to_console({
						foo() {},
						0.2e3: {
							n: 42,
						},
					})
				})

				it("should work -- attributes of pure JSON", () => {
					test_to_console({
						foo: 42,
						bar: "baz",
						gloups: ["gnokman", -0],
						misc: {
							thanks: "for the fish",
						},
					})
				})

				it("should work -- attributes = repeated references", () => {
					const r: any = { foo: "42" }
					const obj: any = { bar: r, baz: r }
					test_to_console(obj)
				})

				it("should work -- attributes containing circular references", () => {
					const obj: any = { foo: "42" }
					obj.bar = obj
					test_to_console(obj)
				})
			})

			describe("circular references", function () {
				it("should work -- array + hashes", () => {
					const o: any = { circular: true }
					const a: any[] = ["circular"]
					o.a = a
					a.push(o)

					test_to_console(o)
				})

				it("should work -- cross", () => {
					const o1: any = { id: 1 }
					const o2: any = { id: 2 }
					o1.ref = o2
					o2.ref = o1

					test_to_console({ o1, o2 })
				})
			})

			describe("functions", function () {
				it("should work -- basic", () => {
					test_to_console((a: number) => {})
					test_to_console(function foo(a: number) {})
				})

				it("should work -- Constructors", () => {
					test_to_console(Number)
				})

				it("should work -- in objects", () => {
					test_to_console({ foo(a: number) {} }) // directly in an object
					test_to_console({ bar: function foo(a: number) {} }) // indirectly in an object
					test_to_console({ bar: (a: number) => {} }) // unnamed in an object
				})

				it("should work -- async", () => {
					test_to_console(async (a: number) => {})
					test_to_console(async function foo(a: number) {})
				})

				it("should work -- generator")
			})

			describe("other objects", function () {
				it("should work -- with objects -- base", () => {
					test_to_console({})
					test_to_console(new Object())
				})

				it("should work -- with objects -- no proto", () => {
					test_to_console(Object.create(null))
				})

				it("should work -- with objects -- this", () => {
					if (should_test_verbose) test_to_console(this)
				})

				it("should work -- with objects -- known global", () => {
					if (should_test_verbose) test_to_console(globalThis)
				})

				it("should work -- with common object types -- Error", () => {
					test_to_console(new Error("foo!"))
					test_to_console(new TypeError("foo!"))
				})

				it("should work -- with common object types -- Set", () => {
					const s0 = new Set()
					test_to_console(s0)

					const s1 = new Set("foo")
					test_to_console(s1)

					const s2 = new Set([
						"foo",
						42,
						//42n,
						true,
						undefined,
						Symbol("foo"),
						null,
						{ X: 33 },
					])
					test_to_console(s2)

					const ws1 = new WeakSet([s0, s1])
					test_to_console(ws1)
				})

				it("should work -- with common object types -- Map", () => {
					test_to_console(new Map())
				})

				it("should work -- with common object types -- primitive types in their object form", () => {
					test_to_console(new String("string"))
					test_to_console(new Number(42))
					test_to_console(new Boolean(true))
				})

				it("should work -- with common object types -- Date", () => {
					const d1 = new Date()
					test_to_console(d1)
				})

				it("should work -- with common object types -- classes", () => {
					class Greeter {
						greeting: string

						constructor(message: string) {
							this.greeting = message
						}

						greet() {
							return "Hello, " + this.greeting
						}
					}

					let greeter = new Greeter("world")

					test_to_console(Greeter)
					test_to_console(greeter)
					function Foo() {}
					test_to_console(Foo)
				})

				// TODO
				it("should work -- with common object types -- Promise", () => {
					test_to_console(Promise.resolve(42))
				})

				// TODO
				it("should work -- with common object types -- Regexp", () => {
					test_to_console(/abc/)
				})
			})
		})

		describe("handling of special cases", function () {
			describe("deep objects", function () {
				const DEPTH = 100
				const deep_obj: any = {
					depth: 0,
				}
				const deep_arr: any = [0]
				const deep_mixed: any = [
					{
						depth: 0,
					},
				]

				let deep_obj_deepest: any = deep_obj
				let deep_arr_deepest: any = deep_arr
				let deep_mixed_deepest: any = deep_mixed

				for (let i = 1; i < DEPTH; ++i) {
					deep_obj_deepest = deep_obj_deepest.sub = {
						depth: i,
					}

					deep_arr_deepest.push([i])
					deep_arr_deepest = deep_arr_deepest[1]
					deep_mixed_deepest = deep_mixed_deepest[0].sub = [
						{
							depth: i * 2,
						},
					]
				}

				it("should handle deep objects -- object", () => {
					//test_to_console(deep_obj)
					console.log("☐ prettifyꓽany(…):", prettifyꓽany(deep_obj))
				})

				it("should handle deep objects -- array", () => {
					console.log("☐ prettifyꓽany(…):", prettifyꓽany(deep_arr))
				})

				it("should handle deep objects -- mixed", () => {
					console.log("☐ prettifyꓽany(…):", prettifyꓽany(deep_mixed))
				})

				it("should handle deep objects - fetch", async () => {
					const ↆf: Promise<any> = fetch("https://www.google.com").catch((err) => {
						if ((err as any).message?.includes("fetch failed")) {
							// offline, let it slide
							// TODO one day find a better complex object
							// or maybe create a server ourselves?
							return err
						}
						throw err
					})

					return ↆf.then((fetch_raw_result: any) => {
						test_to_console(fetch_raw_result)
					})
				})
			})

			it("should handle huge blobs", () => {
				const out = process.env
				test_to_console(out)
			})

			it("should handle objects with no prototype (no .toString)", () => {
				const out = Object.create(null)
				test_to_console(out)
			})

			// TODO
			it("should handle arguments", () => {
				test_to_console(arguments)
			})
		})
	})
})
