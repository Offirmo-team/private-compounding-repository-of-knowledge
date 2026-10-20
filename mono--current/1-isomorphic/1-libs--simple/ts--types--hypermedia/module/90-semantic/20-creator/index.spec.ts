import { describe, it, expect } from "vitest"

import { type Creator, getꓽname, getꓽintro, getꓽemail, getꓽcontact } from "./index.ts"

/////////////////////////////////////////////////

describe(`Web types -- author`, () => {
	describe("selectors", () => {
		it("should work -- empty", () => {
			const out: Creator = {
				urlⵧcanonical: "https://offirmo.net",
				//urlsⵧsocial?: SocialNetworkLink[]
				name: "Offirmo",
				//intro?: string // very short intro. TODO refine
				//email?: Email‿str
				//contact?: Url‿str // should not duplicate email
			}
			expect(getꓽname(out)).toBe("Offirmo")

			expect(getꓽintro(out)).toBe("Offirmo, author.")

			expect(getꓽemail(out)).toBeUndefined()

			expect(getꓽcontact(out)).toBeUndefined()
		})
	})
})
