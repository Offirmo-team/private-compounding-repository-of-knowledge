import { describe, it, expect } from "vitest"

import { normalizeꓽurl } from "@monorepo-private/normalize-string"

import { getꓽuriⵧnormalized‿str } from "./selectors.ts"

/////////////////////////////////////////////////

describe(`@monorepo-private/ts--types--hypermedia -- 01-links -- selectors`, () => {
	describe("getꓽuriⵧnormalized‿str()", () => {
		// copied from normalizeꓽurl() from @monorepo-private/normalize-string
		const TEST_CASES: any = {
			// mailto:
			"mailto:a@b.c": "mailto:a@b.c",
			"mailto:a@b. C": "mailto:a@b.c",

			// httpₓ:
			"https://www.foo.bar?foo=42#1234": "https://www.foo.bar/?foo=42#1234",
			" http: //www. foo. bar": "https://www.foo.bar/",
			" https: //www. foo.bar ": "https://www.foo.bar/",

			"https://www.foo.bar/index.html": "https://www.foo.bar/index.html",
			"https://www.foo.bar/baz": "https://www.foo.bar/baz",

			"https://www.foo.bar?&b=2&a=1": "https://www.foo.bar/?a=1&b=2",

			// unknown
			// recognized as an email
			"a@b.c": "mailto:a@b.c",
			"A@b. c": "mailto:a@b.c",

			// only scheme-specific
			"": "/",
			"/": "/",
			"?&b=2&a=1": "/?a=1&b=2",
			"#xyz": "/#xyz",
		}

		Object.keys(TEST_CASES).forEach((input) => {
			const expected_output = TEST_CASES[input]

			it(`should correctly normalize "${input}" to "${expected_output}"`, () => {
				expect(getꓽuriⵧnormalized‿str(input), "getꓽuriⵧnormalized‿str").toBe(expected_output)
				expect(normalizeꓽurl(input), "normalizeꓽurl").toBe(expected_output)
			})
		})
	})
})
