import { expect } from "chai"

import { getꓽengine } from "@monorepo-private/random"

import { LIB } from "./consts.ts"

import {
	create,
	generate_random_demo_weapon,
	compare_weapons_by_potential,
	getꓽultimate_medium_damage,
} from "./index.ts"

describe(`${LIB} - compare`, function () {
	it("should sort properly by potential", () => {
		const rng = getꓽengine.for_unit_tests()
		const items = [
			generate_random_demo_weapon(rng),
			generate_random_demo_weapon(rng),
			generate_random_demo_weapon(rng),
		].sort(compare_weapons_by_potential)
		const [s1, s2, s3] = items.map(getꓽultimate_medium_damage)
		expect(s1).to.be.above(s2!)
		expect(s2).to.be.above(s3!)
	})

	// extremely rare cases, hard to compute, not even sure it's possible since quality impacts strength
	context("when potential is equal", function () {
		it("should take into account the quality")

		context("when quality is also equal", function () {
			it("should fallback to uuid")
		})
	})
})
