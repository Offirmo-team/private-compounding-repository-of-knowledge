import { describe, it, expect } from "vitest"

import { freezeⵧdeep } from "@monorepo-private/freeze"

import { DELETE, setꓽpropertyⵧdeep } from "./index.ts"

/////////////////////////////////////////////////

describe(`set-deep-property`, () => {
	describe("setꓽpropertyⵧdeep()", () => {
		describe("setting a value", () => {
			it("should work -- already at val = NO MUTATION", () => {
				const current = freezeⵧdeep({ a: { b: { c: 42 } } })
				const next = setꓽpropertyⵧdeep(current, "a.b.c", 42)
				expect(next).toStrictEqual({ a: { b: { c: 42 } } })
				expect(next).toBe(current) // no change
			})

			it("should work -- new val = MUTATION", () => {
				const current = freezeⵧdeep({ a: { b: { c: 42 } } })
				const next = setꓽpropertyⵧdeep(current, "a.b.c", -3)
				expect(next).toStrictEqual({ a: { b: { c: -3 } } })
				expect(next).not.toBe(current)
			})

			it("should work -- alternate separator", () => {
				const current = freezeⵧdeep({
					exports: {
						".": "./foo.ts",
					},
				})
				const next = setꓽpropertyⵧdeep(current, "|exports|./examples", "./examples.ts")
				expect(next).toStrictEqual({
					exports: {
						".": "./foo.ts",
						"./examples": "./examples.ts",
					},
				})
				expect(next).not.toBe(current)
			})

			it("should work -- no change to existing props", () => {
				const current = freezeⵧdeep({
					a: {
						b: 23,
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				const next = setꓽpropertyⵧdeep(current, "a.b", -3)
				expect(next).toStrictEqual({
					a: {
						b: -3,
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				expect(next).not.toBe(current)
				expect(next["foo"]).toBe(current["foo"]) // because we didn't change it
			})

			it("should work -- missing paths = MUTATION", () => {
				const current = freezeⵧdeep({ a: {} })
				const next = setꓽpropertyⵧdeep(current, "a.b.c", 42)
				expect(next).toStrictEqual({ a: { b: { c: 42 } } })
				expect(next).not.toBe(current)
			})
		})

		describe("deleting a value", () => {
			it("should work -- change", () => {
				const current = freezeⵧdeep({
					a: {
						b: -3,
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				const next = setꓽpropertyⵧdeep(current, "a.b", ">DELETE<")
				expect(next).toStrictEqual({
					a: {
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				expect(next).not.toBe(current)
				expect(next["foo"]).toBe(current["foo"]) // because we didn't change it
			})

			it("should work -- missing paths (no change)", () => {
				const current = freezeⵧdeep({})
				const next = setꓽpropertyⵧdeep(current, "a.b.c", ">DELETE<")
				expect(next).toStrictEqual({})
				expect(next).toBe(current) // no change
			})
		})
	})
})
