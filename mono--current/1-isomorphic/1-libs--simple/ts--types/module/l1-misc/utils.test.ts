import { describe, it, expect } from "vitest"

import type { Immutable } from "../l1-immutable/index.ts"

import type { WithId } from "./types.ts"
import { flat_list_to_dict } from "./utils.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/ts--types", () => {
	type FooⳇId = string
	interface Foo extends WithId<FooⳇId> {
		bar: number
		special?: string
	}

	const ALL_FOO: Array<Foo> = [
		{ id: "bar", bar: 23 },
		{ id: "baz", bar: -3, special: "Hello" },
	]

	const ALL_FOOⵧimmutable: Immutable<Array<Foo>> = [
		{ id: "bar", bar: 23 },
		{ id: "baz", bar: -3, special: "Hello" },
	]

	describe("flat_list_to_dict()", () => {
		it("indexes the items by id -- literal list (best)", () => {
			const FOO‿by_id = flat_list_to_dict([
				{ id: "bar", bar: 23 },
				{ id: "baz", bar: -3, special: "Hello" },
			] as const satisfies ReadonlyArray<Immutable<Foo>>)

			expect(FOO‿by_id).toEqual({
				bar: { id: "bar", bar: 23 },
				baz: { id: "baz", bar: -3, special: "Hello" },
			})

			// TYPE CHECKS
			// no error: known id = can't be undefined
			const id: "bar" = FOO‿by_id["bar"].id

			// @ts-expect-error unknown id
			if (FOO‿by_id["xx"]) {
			}

			// @ts-expect-error cannot assign read only
			FOO‿by_id["bar"].bar = 42

			// @ts-expect-error unknown field caught by satisfies
			flat_list_to_dict([{ id: "x", bar: 1, xx: 2 }] as const satisfies ReadonlyArray<Immutable<Foo>>)
		})

		it("indexes the items by id -- NO immu", () => {
			const FOO‿by_id = flat_list_to_dict(ALL_FOO)

			expect(FOO‿by_id).toEqual({
				bar: ALL_FOO[0],
				baz: ALL_FOO[1],
			})

			// TYPE CHECKS
			// @ts-expect-error value may be undefined
			if (FOO‿by_id["bar"].bar) {
			}

			// no error but not ideal
			if (FOO‿by_id["bar"]!.bar) {
			}

			// unknown attribute
			// @ts-expect-error property doesn't exist
			if (FOO‿by_id["bar"]!.xx) {
			}

			// no error (but bad!)
			FOO‿by_id["bar"]!.id = "123"
		})

		it("indexes the items by id -- immu", () => {
			const FOO‿by_id = flat_list_to_dict(ALL_FOOⵧimmutable)

			expect(FOO‿by_id).toEqual({
				bar: ALL_FOO[0],
				baz: ALL_FOO[1],
			})

			// TYPE CHECKS
			// @ts-expect-error value may be undefined
			if (FOO‿by_id["bar"].bar) {
			}

			// no error
			if (FOO‿by_id["bar"]!.bar) {
			}

			// unknown param
			// @ts-expect-error property doesn't exist
			if (FOO‿by_id["bar"]!.xx) {
			}

			// @ts-expect-error cannot assign read only
			FOO‿by_id["bar"]!.id = "123"
		})

		it("rejects duplicate ids", () => {
			expect(() => flat_list_to_dict([...ALL_FOO, { id: "bar", bar: 0 }])).toThrow()
		})

		it("rejects empty ids", () => {
			expect(() => flat_list_to_dict([{ id: "" }])).toThrow()
		})
	})
})
