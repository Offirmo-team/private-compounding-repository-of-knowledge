//import chalk from 'chalk'
//import { injectꓽlibꓽchalk } from './injectable-lib--chalk.ts'
//injectꓽlibꓽchalk(chalk as any)
import { describe, expect, it } from "vitest"

import { cmp } from "./utils.ts"

/////////////////////////////////////////////////

describe("@monorepo-private/prettify-any - utils", function () {
	describe("cmp()", function () {
		it("should work with numbers", () => {
			expect(cmp(0, 0), "equal").toBe(0)
			expect(cmp(0, 2.4), "ordered 1").toBe(-1)
			expect(cmp(-2, 0), "ordered 2").toBe(-1)
			expect(cmp(2, 0), "reverse").toBe(1)
		})

		it("should work with strings", () => {
			expect(cmp("a", "a"), "equal").toBe(0)
			expect(cmp("a", "b"), "ordered").toBe(-1)
			expect(cmp("z", "a"), "reverse").toBe(1)
		})

		it("should work with symbols", () => {
			const a = Symbol("a") as any
			const b = Symbol("b") as any
			expect(cmp(a, a), "equal").toBe(0)
			expect(cmp(a, b), "ordered").toBe(-1)
			expect(cmp(b, a), "reverse").toBe(1)
		})

		it("should work with any possible object keys", () => {
			const str = "0" as any
			const sym = Symbol("0") as any
			const num = 0 as any

			expect(cmp(num, str), "1").toBe(-1)
			expect(cmp(str, sym), "2").toBe(-1)
			expect(cmp(num, sym), "3").toBe(-1)
		})
	})
})
