import { expect } from "chai"

import { json_stable_stringify } from "./index.ts"

describe("json-stable-stringify", function () {
	// test that we perform exactly as JSON.stringify for already sorted data
	describe("SORTABLE situations", function () {
		function test_against_builtin(value: any): void {
			const resultⵧbuiltin = (() => {
				try {
					return JSON.stringify(value, null, undefined)
				} catch (err) {
					return `<exception! ${(err as any)?.message?.split("\n")?.[0]}>`
				}
			})()

			const resultⵧstable = (() => {
				try {
					return json_stable_stringify(value, { indent: null })
				} catch (err) {
					return `<exception! ${(err as any)?.message?.split("\n")?.[0]}>`
				}
			})()

			if (resultⵧbuiltin === resultⵧstable) {
				if (resultⵧstable === "<exception! Converting circular structure to JSON>") {
					// this case is valid
					return
				}
				console.log("☑ JSON.stringify    :", resultⵧbuiltin)
				console.log("☐ stable-stringify  :", resultⵧstable)
				throw new Error("Unexpected equality. Is it a sortable situation?")
			} else {
				if (resultⵧbuiltin.length !== resultⵧstable?.length) {
					console.log("≡")
					console.log("☑ JSON.stringify    :", resultⵧbuiltin)
					console.log("☐ stable-stringify  :", resultⵧstable)
				}
			}
			expect(resultⵧstable).not.to.equal(resultⵧbuiltin)
			expect(resultⵧstable?.length).to.equal(resultⵧbuiltin.length)
		}

		describe("handling of sortable nodes", function () {
			// objects are the only thing that need stability
			describe("objects/hashes", function () {
				// see deterministic ECMA ordering https://262.ecma-international.org/6.0/#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys
				it("should work with attributes of primitive types  (key + value) -- strings", () => {
					test_against_builtin({
						k: undefined,
						z: 0,
						[Symbol("key")]: "bar",
						a: 0,
					})
				})

				// stringify sorts integers?
				it.skip("should work with attributes of primitive types  (key + value) -- integers", () => {
					test_against_builtin({
						k: undefined,
						2: 0,
						[Symbol("key")]: "bar",
						1: 0,
					})
				})
				it("should work with attributes of primitive types  (key + value) -- mixed", () => {
					test_against_builtin({
						z: 0,
						a: 0,
						10: 0,
						3: 0,
					})
				})

				it("should work with attributes of pure JSON", () => {
					test_against_builtin({
						foo: 42,
						bar: "baz",
						gloups: ["gnokman", -0],
						misc: {
							thanks: "for the fish",
						},
					})
				})

				it("should work with attributes = repeated references (NOT circular)", () => {
					const r: any = { foo: "42" }
					const obj: any = { baz: r, bar: r }
					test_against_builtin(obj)
				})

				it("should work with attributes containing circular references", () => {
					const obj: any = { foo: "42" }
					obj.bar = obj
					test_against_builtin(obj)
				})
			})
		})

		describe("special cases", function () {
			it.skip("should be able to handle huge blobs", () => {
				// brittle test, rely on process.env not being sorted
				test_against_builtin(process.env)
			})
		})
	})
})
