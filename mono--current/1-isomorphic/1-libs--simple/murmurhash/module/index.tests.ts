import { expect } from "chai"

import MurmurHash from "./index.ts"

describe("@monorepo-private/murmurhash", function () {
	describe("v3", function () {
		describe("x64", function () {
			describe("hashꓽstringⵧ128()", function () {
				// https://cimi.io/murmurhash3js-revisited/
				const TEST_CASES = {
					"I will not buy this record, it is scratched.": "c382657f9a06c49d4a71fdc6d9b0d48f",
					"I will not buy this tobaconnists, it is scratched.": "3806612222fe88e1af1a4b5a59115634",
					"My hovercraft is full of eels.": "03e5e14d358c16d1e5ae86df7ed5cfcb",
					"My 🚀 is full of 🦎.": "d047391e58c6c9dfccde62c92e049f50",
					"吉 星 高 照": "bde3d304c55081c5749baf93de78c3bd",
				}
				Object.entries(TEST_CASES).forEach(([str, expected_hash], index) => {
					it(`should work - #${index}`, () => {
						const result = MurmurHash.v3.x64ⵧ128.hashꓽstring(str)
						expect(result).to.be.a("string")
						expect(result).to.have.lengthOf(32)
						expect(result).to.equal(expected_hash)
					})
				})
			})

			describe("hashꓽobjectⵧ128()", function () {
				it("should work", () => {
					const result = MurmurHash.v3.x64ⵧ128.hashꓽobject({ foo: "bar" })
					expect(result).to.be.a("string")
					expect(result).to.have.lengthOf(32)
					expect(result).to.equal("7e22688c5fd1e9b5dd3bed16d829db6a") // self seen
				})

				it("should be stable", () => {
					const result1 = MurmurHash.v3.x64ⵧ128.hashꓽobject({ foo: 42, bar: "baz" })
					expect(result1).to.be.a("string")
					expect(result1).to.have.lengthOf(32)
					expect(result1).to.equal("ba719d7f1749a82c0f13b573fc79a49d") // self seen

					const result2 = MurmurHash.v3.x64ⵧ128.hashꓽobject({ bar: "baz", foo: 42 })
					expect(result2).to.be.a("string")
					expect(result2).to.have.lengthOf(32)
					expect(result2).to.equal("ba719d7f1749a82c0f13b573fc79a49d") // self seen
				})
			})
		})
	})
})
