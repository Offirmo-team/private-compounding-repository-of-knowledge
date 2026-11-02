/////////////////////////////////////////////////

describe(`@monorepo-private/assert`, () => {
	describe("assert_from()", () => {
		function my_func() {}

		describe("when misused", () => {
			it("should throw a clear error -- assert_from()", () => {
				expect(() => assert_from({}), "empty").toThrow(
					"[@monorepo-private/assert] assert_from(): Invalid argument: fn_in_obj should have exactly 1 entry ex. { foo }, got 0!",
				)
				expect(() => assert_from({ my_func, other: my_func }), "multiple").toThrow(
					"[@monorepo-private/assert] assert_from(): Invalid argument: fn_in_obj should have exactly 1 entry ex. { foo }, got 2!",
				)
				expect(() => assert_from(null as any), "null").toThrow(
					"[@monorepo-private/assert] assert_from(): Invalid argument: fn_in_obj should be an object ex. { foo }!",
				)
				expect(() => assert_from({ my_func: 42 } as any), "not a function").toThrow(
					"[@monorepo-private/assert] assert_from(): Invalid argument: fn_in_obj should contain a function ex. { my_func }!",
				)
			})

			it("should throw a clear error -- forⵧparam() / forⵧvalue()", () => {
				const ǃ = assert_from({ my_func })
				expect(() => ǃ.forⵧparam({ a: 1, b: 2 }), "param").toThrow(
					"[@monorepo-private/assert] forⵧparam(): Invalid argument: value_in_obj should have exactly 1 entry ex. { foo }, got 2!",
				)
				expect(() => ǃ.forⵧvalue({}), "value").toThrow(
					"[@monorepo-private/assert] forⵧvalue(): Invalid argument: value_in_obj should have exactly 1 entry ex. { foo }, got 0!",
				)
			})
		})

		describe("check()", () => {
			// check = generic "inspect/test" semantic, cf. 12-concepts--assertions.md
			it("should keep a generic semantic whatever the scope", () => {
				const ǃ = assert_from({ my_func })
				const x = 42

				expect(ǃ.forⵧparam({ x }).check(false)?.name, "param").toBe("AssertionFailed")
				expect(ǃ.forⵧvalue({ x }).check(false)?.name, "value").toBe("AssertionFailed")
				expect(ǃ.check(false)?.name, "root").toBe("AssertionFailed")
			})
		})

		// type-level only: checked by `tsc` (check:ts)
		it("should NOT offer an ambiguous assert() on params", () => {
			const ǃ = assert_from({ my_func })
			const x = 42
			// @ts-expect-error params = preconditions = require()
			ǃ.forⵧparam({ x }).assert
		})
	})

	describe("assertⵧnever_reached()", () => {
		describe("at runtime", () => {
			it("should throw an UnreachablePathError", () => {
				expect(() => assertⵧnever_reached({ foo: "c" as never })).toThrow(
					expect.objectContaining({ name: "UnreachablePathError" }),
				)
			})

			it("should display the variable name + unexpected primitive value", () => {
				expect(() => assertⵧnever_reached({ foo: "c" as never }), "string").toThrow(
					'Unreachable branch executed: foo = "c"!',
				)
				expect(() => assertⵧnever_reached({ foo: 42 as never }), "number").toThrow(
					"Unreachable branch executed: foo = 42!",
				)
				expect(() => assertⵧnever_reached({ foo: 42n as never }), "bigint").toThrow(
					"Unreachable branch executed: foo = 42n!",
				)
				expect(() => assertⵧnever_reached({ foo: true as never }), "boolean").toThrow(
					"Unreachable branch executed: foo = true!",
				)
				expect(() => assertⵧnever_reached({ foo: undefined as never }), "undefined").toThrow(
					"Unreachable branch executed: foo = undefined!",
				)
				expect(() => assertⵧnever_reached({ foo: null as never }), "null").toThrow(
					"Unreachable branch executed: foo = null!",
				)
				expect(() => assertⵧnever_reached({ foo: Symbol("bar") as never }), "symbol").toThrow(
					"Unreachable branch executed: foo = Symbol(bar)!",
				)
			})

			it("should escape strings", () => {
				expect(() => assertⵧnever_reached({ foo: 'a"\nb' as never })).toThrow(
					'Unreachable branch executed: foo = "a\\"\\nb"!',
				)
			})

			it("should NOT display non-primitive values", () => {
				expect(() => assertⵧnever_reached({ foo: { secret: 42 } as never }), "object").toThrow(
					"Unreachable branch executed: foo = <object>!",
				)
				expect(() => assertⵧnever_reached({ foo: (() => {}) as never }), "function").toThrow(
					"Unreachable branch executed: foo = <function>!",
				)
			})

			it("should prepend the optional extra description", () => {
				expect(
					() => assertⵧnever_reached({ foo: "c" as never }, { extra_description: "unknown foo" }),
					"string",
				).toThrow('Unreachable branch executed: unknown foo (foo = "c")!')
				expect(
					() => assertⵧnever_reached({ foo: "c" as never }, { extra_description: () => "unknown foo" }),
					"lazy",
				).toThrow('Unreachable branch executed: unknown foo (foo = "c")!')
			})

			describe("when a discriminant is provided", () => {
				it("should display only the discriminant of an object", () => {
					const shape = { kind: "triangle", secret: 42 } as never
					expect(() => assertⵧnever_reached({ shape }, { discriminant: "kind" })).toThrow(
						'Unreachable branch executed: shape.kind = "triangle"!',
					)
				})

				it("should NOT display a non-primitive discriminant", () => {
					const shape = { kind: { secret: 42 } } as never
					expect(() => assertⵧnever_reached({ shape }, { discriminant: "kind" })).toThrow(
						"Unreachable branch executed: shape.kind = <object>!",
					)
				})

				it("should handle a missing discriminant (malformed data)", () => {
					const shape = { r: 1 } as never
					expect(() => assertⵧnever_reached({ shape }, { discriminant: "kind" })).toThrow(
						"Unreachable branch executed: shape.kind = undefined!",
					)
				})

				it("should handle non-string keys", () => {
					const KIND = Symbol("kind")
					expect(
						() => assertⵧnever_reached({ shape: { [KIND]: "triangle" } as never }, { discriminant: KIND }),
						"symbol",
					).toThrow('Unreachable branch executed: shape[Symbol(kind)] = "triangle"!')
					expect(
						() => assertⵧnever_reached({ tuple: ["triangle"] as never }, { discriminant: 0 }),
						"number",
					).toThrow('Unreachable branch executed: tuple[0] = "triangle"!')
				})

				it("should ignore the discriminant when the value is not an object (malformed data)", () => {
					expect(() => assertⵧnever_reached({ shape: "oops" as never }, { discriminant: "kind" })).toThrow(
						'Unreachable branch executed: shape = "oops"!',
					)
					expect(() => assertⵧnever_reached({ shape: null as never }, { discriminant: "kind" })).toThrow(
						"Unreachable branch executed: shape = null!",
					)
				})

				it("should combine with the extra description", () => {
					const shape = { kind: "triangle" } as never
					expect(() =>
						assertⵧnever_reached({ shape }, { discriminant: "kind", extra_description: "unknown shape" }),
					).toThrow('Unreachable branch executed: unknown shape (shape.kind = "triangle")!')
				})
			})

			it("should throw a clear error when misused", () => {
				expect(() => assertⵧnever_reached({}), "empty").toThrow(
					"[@monorepo-private/assert] assertⵧnever_reached(): Invalid argument: value_in_obj should have exactly 1 entry ex. { foo }, got 0!",
				)
				expect(() => assertⵧnever_reached({ a: 1 as never, b: 2 as never }), "multiple").toThrow(
					"[@monorepo-private/assert] assertⵧnever_reached(): Invalid argument: value_in_obj should have exactly 1 entry ex. { foo }, got 2!",
				)
			})
		})

		// type-level only: checked by `tsc` (check:ts), the functions are never executed
		it("should enforce exhaustiveness at compile time", () => {
			type Foo = "a" | "b"

			function exhaustive(foo: Foo): number {
				switch (foo) {
					case "a":
						return 1
					case "b":
						return 2
					default:
						assertⵧnever_reached({ foo })
				}
			}

			function non_exhaustive(foo: Foo): number {
				switch (foo) {
					case "a":
						return 1
					default:
						// @ts-expect-error "b" is not handled
						assertⵧnever_reached({ foo })
				}
			}

			function legacy_no_arg(foo: Foo): number {
				switch (foo) {
					case "a":
					case "b":
						return 1
					default:
						// @ts-expect-error the switch subject is required
						assertⵧnever_reached()
				}
			}
		})

		it("should enforce exhaustiveness at compile time -- discriminated unions", () => {
			type Shape = { kind: "circle"; r: number } | { kind: "square"; side: number }

			function exhaustive(shape: Shape): number {
				switch (shape.kind) {
					case "circle":
						return shape.r
					case "square":
						return shape.side
					default:
						assertⵧnever_reached({ shape })
				}
			}

			function non_exhaustive__whole(shape: Shape): number {
				switch (shape.kind) {
					case "circle":
						return shape.r
					default:
						// @ts-expect-error "square" is not handled
						assertⵧnever_reached({ shape })
				}
			}

			// recommended: whole object + discriminant option → TS safety + discriminant displayed at runtime
			function exhaustive__discriminant_option(shape: Shape): number {
				switch (shape.kind) {
					case "circle":
						return shape.r
					case "square":
						return shape.side
					default:
						assertⵧnever_reached({ shape }, { discriminant: "kind" })
				}
			}

			function non_exhaustive__discriminant_option(shape: Shape): number {
				switch (shape.kind) {
					case "circle":
						return shape.r
					default:
						// @ts-expect-error "square" is not handled
						assertⵧnever_reached({ shape }, { discriminant: "kind" })
				}
			}

			// alternative: hoisted discriminant = primitive → its value will be displayed at runtime
			function exhaustive__hoisted_discriminant(shape: Shape): number {
				const kind = shape.kind
				switch (kind) {
					case "circle":
						return shape.r
					case "square":
						return shape.side
					default:
						assertⵧnever_reached({ kind })
				}
			}

			function non_exhaustive__hoisted_discriminant(shape: Shape): number {
				const kind = shape.kind
				switch (kind) {
					case "circle":
						return shape.r
					default:
						// @ts-expect-error "square" is not handled
						assertⵧnever_reached({ kind })
				}
			}

			function exhaustive__non_hoisted_discriminant(shape: Shape): number {
				switch (shape.kind) {
					case "circle":
						return shape.r
					case "square":
						return shape.side
					default:
						// @ts-expect-error shape is `never` = has no props, see GOTCHA in the source
						assertⵧnever_reached({ "shape.kind": shape.kind })
				}
			}
		})

		it("should enforce exhaustiveness at compile time -- property of a non-union", () => {
			type Options = { mode: "a" | "b" }

			function exhaustive(options: Options): number {
				switch (options.mode) {
					case "a":
						return 1
					case "b":
						return 2
					default:
						assertⵧnever_reached({ "options.mode": options.mode })
				}
			}

			function non_exhaustive(options: Options): number {
				switch (options.mode) {
					case "a":
						return 1
					default:
						// @ts-expect-error "b" is not handled
						assertⵧnever_reached({ "options.mode": options.mode })
				}
			}
		})
	})
})

/////////////////////////////////////////////////

import { describe, it, expect } from "vitest"

import { assert_from, assertⵧnever_reached } from "@monorepo-private/assert"
