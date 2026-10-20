import { describe, it, expect } from "vitest"

import type { Immutable } from "@monorepo-private/ts--types"

import { compare } from "./index.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/ts--utils -- comparison", () => {
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

	function getꓽage(p: Immutable<Person>): number {
		return p.age
	}

	describe("compare()", () => {
		it("should work", () => {
			expect(compare(p1, "===", p2, getꓽage)).toBe(false)
			expect(compare(p1, "!==", p2, getꓽage)).toBe(true)
			expect(compare(p1, ">", p2, getꓽage)).toBe(true)
			expect(compare(p1, ">=", p2, getꓽage)).toBe(true)
			expect(compare(p1, "<", p2, getꓽage)).toBe(false)
			expect(compare(p1, "<=", p2, getꓽage)).toBe(false)

			expect(compare(p2, "===", p3, getꓽage)).toBe(true)
			expect(compare(p2, "!==", p3, getꓽage)).toBe(false)
			expect(compare(p2, ">", p3, getꓽage)).toBe(false)
			expect(compare(p2, ">=", p3, getꓽage)).toBe(true)
			expect(compare(p2, "<", p3, getꓽage)).toBe(false)
			expect(compare(p2, "<=", p3, getꓽage)).toBe(true)
		})
	})
})
