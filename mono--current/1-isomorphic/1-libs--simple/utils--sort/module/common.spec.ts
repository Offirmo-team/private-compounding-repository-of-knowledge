import { describe, it, expect } from "vitest"

import type { Immutable } from "@monorepo-private/ts--types"

import { getꓽcompareFn } from "./common.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/utils--sort", () => {
	interface Person {
		name: string
		type: "adult" | "child"
		age: number
	}

	const p1: Person = {
		type: "adult",

		name: "parent",
		age: 33,
	}

	const c1: Person = {
		type: "child",

		name: "child1",
		age: 3,
	}

	const c2: Person = {
		type: "child",

		name: "child2",
		age: 3,
	}

	function getꓽage(p: Immutable<Person>): number {
		return p.age
	}

	describe("getꓽcompareFn()", () => {
		it("should work", () => {
			const compare1 = getꓽcompareFn(getꓽage)
			const compare2 = getꓽcompareFn(getꓽage, ">")
			const a1 = [c2, p1, c1]

			const s1 = a1.toSorted(compare1)
			expect(s1.map((p) => p.name)).toStrictEqual(["child2", "child1", "parent"])

			const s2 = a1.toSorted(compare2)
			expect(s2.map((p) => p.name)).toStrictEqual(["parent", "child2", "child1"])
		})
	})
})
