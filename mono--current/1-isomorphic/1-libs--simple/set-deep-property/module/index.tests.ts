import { expect } from "chai"
import { freeze } from "icepick"

import { DELETE, setꓽpropertyⵧdeep } from "./index.ts"

/////////////////////////////////////////////////

describe(`set-deep-property`, function () {
	describe("setꓽpropertyⵧdeep()", function () {
		describe("setting a value", () => {
			it("should work -- already at val = NO MUTATION", () => {
				const current = freeze({ a: { b: { c: 42 } } })
				const next = setꓽpropertyⵧdeep(current, "a.b.c", 42)
				expect(next).to.deep.equal({ a: { b: { c: 42 } } })
				expect(next).to.equal(current) // no change
			})

			it("should work -- new val = MUTATION", () => {
				const current = freeze({ a: { b: { c: 42 } } })
				const next = setꓽpropertyⵧdeep(current, "a.b.c", -3)
				expect(next).to.deep.equal({ a: { b: { c: -3 } } })
				expect(next).not.to.equal(current)
			})

			it("should work -- alternate separator", () => {
				const current = freeze({
					exports: {
						".": "./foo.ts",
					},
				})
				const next = setꓽpropertyⵧdeep(current, "|exports|./examples", "./examples.ts")
				expect(next).to.deep.equal({
					exports: {
						".": "./foo.ts",
						"./examples": "./examples.ts",
					},
				})
				expect(next).not.to.equal(current)
			})

			it("should work -- no change to existing props", () => {
				const current = freeze({
					a: {
						b: 23,
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				const next = setꓽpropertyⵧdeep(current, "a.b", -3)
				expect(next).to.deep.equal({
					a: {
						b: -3,
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				expect(next).not.to.equal(current)
				expect(next["foo"]).to.equal(current["foo"]) // because we didn't change it
			})

			it("should work -- missing paths = MUTATION", () => {
				const current = freeze({ a: {} })
				const next = setꓽpropertyⵧdeep(current, "a.b.c", 42)
				expect(next).to.deep.equal({ a: { b: { c: 42 } } })
				expect(next).not.to.equal(current)
			})
		})

		describe("deleting a value", () => {
			it("should work -- change", () => {
				const current = freeze({
					a: {
						b: -3,
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				const next = setꓽpropertyⵧdeep(current, "a.b", ">DELETE<")
				expect(next).to.deep.equal({
					a: {
						z: "hi",
					},
					foo: {
						bar: 42,
					},
				})
				expect(next).not.to.equal(current)
				expect(next["foo"]).to.equal(current["foo"]) // because we didn't change it
			})

			it("should work -- missing paths (no change)", () => {
				const current = freeze({})
				const next = setꓽpropertyⵧdeep(current, "a.b.c", ">DELETE<")
				expect(next).to.deep.equal({})
				expect(next).to.equal(current) // no change
			})
		})
	})
})
