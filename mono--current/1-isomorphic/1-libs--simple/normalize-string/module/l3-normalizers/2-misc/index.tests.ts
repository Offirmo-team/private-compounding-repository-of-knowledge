import { expect } from "chai"

import { LIB } from "../../consts.ts"
import type { StringNormalizer } from "../../l1-types/types.ts"

import * as NORMALIZERS from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- misc`, function () {
	const TEST_CASES: any = {
		coerce_toꓽtokens: {
			"": "",
			" ": "",
			A: "a",
			"BoReD ": "bored",
			"ALPH-Art": "alph art",
			" continued from ": "continued from",
		},

		coerce_toꓽredeemable_code: {
			"": "",
			" ": "",
			a: "A",
			"bored ": "BORED",
			"ALPH-Art": "ALPHART",
		},

		normalizeꓽIETFLanguageType: {
			"": "en",
			en: "en",
			EN: "en",
			"en-US": "en-us",
			" en- Us ": "en-us",
		},
	}
	Object.keys(NORMALIZERS).forEach((key) => {
		if (key === "LANGⵧDEFAULT") return

		if (!TEST_CASES[key]) throw new Error(`(internal check) Missing test cases for normalizer "${key}"!`)
	})

	Object.keys(TEST_CASES).forEach((key) => {
		const normalizer: StringNormalizer = (NORMALIZERS as any)[key]
		if (!normalizer) throw new Error(`Wrong test case for unknown normalizer "${key}"!`)

		describe(`normalizer "${key}"`, function () {
			const NORMALIZER_TEST_CASES = TEST_CASES[key]
			Object.keys(NORMALIZER_TEST_CASES).forEach((input) => {
				const expected_output = NORMALIZER_TEST_CASES[input]

				it(`should correctly normalize "${input}" to "${expected_output}"`, () => {
					const res = normalizer(input)
					expect(res).to.equal(expected_output)
				})
			})
		})
	})
})
