import { expect } from "chai"

import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽcompareFnⵧby_resolved_enum } from "./by-enum.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/utils--sort", function () {
	interface Person {
		name: string
		type: "adult" | "child"
		age: number
	}

	const p1: Person = {
		type: "adult",

		name: "parent1",
		age: 33,
	}

	const p2: Person = {
		type: "child",

		name: "child1",
		age: 3,
	}

	const p3: Person = {
		type: "child",

		name: "child2",
		age: 3,
	}

	describe("getꓽcompareFnⵧby_resolved_enum()", function () {
		it("should work -- attribute", () => {
			const a1 = [p2, p1, p3]

			const s1 = a1.toSorted(getꓽcompareFnⵧby_resolved_enum("type", ["adult", "child"]))
			expect(s1.map((p) => p.name)).to.deep.equal(["parent1", "child1", "child2"])

			const s2 = a1.toSorted(getꓽcompareFnⵧby_resolved_enum("type", ["child", "adult"]))
			expect(s2.map((p) => p.name)).to.deep.equal(["child1", "child2", "parent1"])
		})
	})
})
