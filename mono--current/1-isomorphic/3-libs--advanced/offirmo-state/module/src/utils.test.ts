import { describe, it, expect } from "vitest"

import { LIB } from "./consts.ts"
import { enforceꓽimmutable, getꓽmutable_copy } from "./utils.ts"

/////////////////////////////////////////////////

describe(`${LIB} - utils`, () => {
	describe("getꓽmutable_copy()", () => {
		interface Sub {
			foo: number
		}

		it("should deep copy a frozen object", () => {
			const original = enforceꓽimmutable<{ sub: Sub }>({ sub: { foo: 42 } })

			const copy = getꓽmutable_copy(original)
			copy.sub.foo = 33

			expect(copy).toEqual({ sub: { foo: 33 } })
			expect(original).toEqual({ sub: { foo: 42 } })
		})

		it("should deep copy a non-frozen object", () => {
			const original = { sub: { foo: 42 } }

			const copy = getꓽmutable_copy(original)
			copy.sub.foo = 33

			expect(copy).not.toBe(original)
			expect(original).toEqual({ sub: { foo: 42 } })
		})

		it("should deep copy a non-frozen object having frozen children", () => {
			// typical of a reducer: { ...state, x: … }
			const original = { sub: enforceꓽimmutable<Sub>({ foo: 42 }) }

			const copy = getꓽmutable_copy(original)
			copy.sub.foo = 33

			expect(copy).toEqual({ sub: { foo: 33 } })
			expect(original).toEqual({ sub: { foo: 42 } })
		})
	})
})
