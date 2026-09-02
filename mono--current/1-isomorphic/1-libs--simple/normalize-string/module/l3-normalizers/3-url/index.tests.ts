import { expect } from "chai"

import { LIB } from "../../consts.ts"
import type { StringNormalizer } from "../../l1-types/types.ts"

import * as NORMALIZERS from "./index.ts"

/////////////////////////////////////////////////

describe(`${LIB} -- url`, function () {
	const TEST_CASES_BY_PROTOCOL: any = {
		mailto: {
			"mailto:a@b.c": "mailto:a@b.c",
			"mailto:a@b. C": "mailto:a@b.c",
		},

		httpₓ: {
			"https://www.foo.bar?foo=42#1234": "https://www.foo.bar/?foo=42#1234",
			" http: //www. foo. bar": "https://www.foo.bar/",
			" https: //www. foo.bar ": "https://www.foo.bar/",

			"https://www.foo.bar/index.html": "https://www.foo.bar/index.html",
			"https://www.foo.bar/baz": "https://www.foo.bar/baz",

			"https://www.foo.bar?&b=2&a=1": "https://www.foo.bar/?a=1&b=2",
		},

		undefined: {
			// recognized as an email
			"a@b.c": "mailto:a@b.c",
			"A@b. c": "mailto:a@b.c",

			// only scheme-specific
			"": "/",
			"/": "/",
			"?&b=2&a=1": "/?a=1&b=2",
			"#xyz": "/#xyz",
		},
	}

	const TEST_CASES: any = {
		normalizeꓽurl: {
			...TEST_CASES_BY_PROTOCOL.mailto,
			...TEST_CASES_BY_PROTOCOL.httpₓ,
			...TEST_CASES_BY_PROTOCOL.undefined,
		},

		normalizeꓽurlⵧhttpₓ: {
			...TEST_CASES_BY_PROTOCOL.httpₓ,
		},
	}
	Object.keys(NORMALIZERS)
		.filter((k) => k !== "FAKE_ORIGIN")
		.forEach((key) => {
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
