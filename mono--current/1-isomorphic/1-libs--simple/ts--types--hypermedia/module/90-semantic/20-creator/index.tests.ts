import { expect } from "chai"

import { type Creator, getꓽname, getꓽintro, getꓽemail, getꓽcontact } from "./index.ts"

/////////////////////////////////////////////////

describe(`Web types -- author`, function () {
	describe("selectors", function () {
		it("should work -- empty", () => {
			const out: Creator = {
				urlⵧcanonical: "https://offirmo.net",
				//urlsⵧsocial?: SocialNetworkLink[]
				name: "Offirmo",
				//intro?: string // very short intro. TODO refine
				//email?: Email‿str
				//contact?: Url‿str // should not duplicate email
			}
			expect(getꓽname(out)).to.deep.equal("Offirmo")

			expect(getꓽintro(out)).to.deep.equal("Offirmo, author.")

			expect(getꓽemail(out)).to.be.undefined

			expect(getꓽcontact(out)).to.be.undefined
		})
	})
})
