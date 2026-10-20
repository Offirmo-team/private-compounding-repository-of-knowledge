/////////////////////////////////////////////////

// The shape our asset modules actually use -- see @monorepo-private/assets--background
const CALL_SITEⵧreal = `const local_url = new URL("original.png?as=webp&width=1920", import.meta.url).href`

/////////////////////////////////////////////////

describe(`@monorepo-private/vite-plugin-parcel-features -- image directives`, () => {
	describe("parseꓽimage_references()", () => {
		it(`finds the real-world call site and reads its directives`, () => {
			const [reference, ...others] = parseꓽimage_references(CALL_SITEⵧreal)

			expect(others).toHaveLength(0)
			expect(reference).toMatchObject({
				pathⳇrelative: "original.png",
				directives: { format: "webp", width: 1920, height: undefined, quality: undefined },
			})
		})

		it(`reports indices delimiting the specifier's content, quotes EXCLUDED`, () => {
			const [reference] = parseꓽimage_references(CALL_SITEⵧreal)

			// the contract the plugin's MagicString splice relies on
			expect(CALL_SITEⵧreal.slice(reference!.start‿index, reference!.end‿index)).toBe(
				"original.png?as=webp&width=1920",
			)
		})

		it(`handles single-quoted specifiers too`, () => {
			const references = parseꓽimage_references(`new URL('a.png?as=webp', import.meta.url)`)

			expect(references).toHaveLength(1)
			expect(references[0]!.pathⳇrelative).toBe("a.png")
		})

		it(`tolerates whitespace variations`, () => {
			const references = parseꓽimage_references(`new  URL (\n\t"a.png?w=10" ,\n\timport . meta . url\n)`)

			expect(references).toHaveLength(1)
		})

		it(`finds every reference in a module`, () => {
			const code = [
				`new URL("a.png?as=webp", import.meta.url)`,
				`new URL("sub/dir/b.jpg?width=100", import.meta.url)`,
			].join("\n")

			expect(parseꓽimage_references(code).map((r) => r.pathⳇrelative)).toEqual(["a.png", "sub/dir/b.jpg"])
		})

		describe("skipping", () => {
			it(`skips a reference with NO directives -- Vite's own pipeline already handles those`, () => {
				expect(parseꓽimage_references(`new URL("./foo.png", import.meta.url)`)).toHaveLength(0)
			})

			it(`skips a query we don't own, ex. Vite's "?url"`, () => {
				expect(parseꓽimage_references(`new URL("./foo.png?url", import.meta.url)`)).toHaveLength(0)
			})

			it(`skips non-image extensions`, () => {
				expect(parseꓽimage_references(`new URL("./data.json?as=webp", import.meta.url)`)).toHaveLength(0)
			})

			it(`skips extension-less paths`, () => {
				expect(parseꓽimage_references(`new URL("./foo?as=webp", import.meta.url)`)).toHaveLength(0)
			})

			it(`ignores a template literal -- dynamic, so there'd be nothing to resolve at build time`, () => {
				expect(parseꓽimage_references("new URL(`./a-${n}.png?as=webp`, import.meta.url)")).toHaveLength(0)
			})

			it(`ignores a second argument that isn't import.meta.url`, () => {
				expect(parseꓽimage_references(`new URL("a.png?as=webp", base_url)`)).toHaveLength(0)
			})
		})
	})

	describe("parseꓽdirectives()", () => {
		it(`accepts Parcel's names`, () => {
			expect(parseꓽdirectives("as=webp&width=800&height=600&quality=70", "png")).toEqual({
				format: "webp",
				width: 800,
				height: 600,
				quality: 70,
			})
		})

		it(`accepts the short aliases`, () => {
			expect(parseꓽdirectives("format=avif&w=800&h=600&q=70", "png")).toEqual({
				format: "avif",
				width: 800,
				height: 600,
				quality: 70,
			})
		})

		it(`falls back to the source format when only a resize is asked`, () => {
			expect(parseꓽdirectives("width=800", "jpeg")).toMatchObject({ format: "jpeg", width: 800 })
		})

		it(`returns undefined when there is nothing actionable`, () => {
			expect(parseꓽdirectives("", "png")).toBeUndefined()
			expect(parseꓽdirectives("url", "png")).toBeUndefined()
		})

		it(`ignores non-positive / malformed numbers rather than failing the build`, () => {
			expect(parseꓽdirectives("as=webp&width=abc&height=0&quality=-5", "png")).toEqual({
				format: "webp",
				width: undefined,
				height: undefined,
				quality: undefined,
			})
		})
	})

	describe("getꓽderived__name()", () => {
		it(`encodes the directives`, () => {
			expect(
				getꓽderived__name("original.png", { format: "webp", width: 1920, height: undefined, quality: undefined }),
			).toBe("original@w1920.webp")
		})

		it(`encodes every directive in a stable order`, () => {
			expect(getꓽderived__name("a.png", { format: "avif", width: 8, height: 6, quality: 70 })).toBe("a@w8h6q70.avif")
		})

		it(`omits the suffix when only the format changes`, () => {
			expect(
				getꓽderived__name("a.png", { format: "webp", width: undefined, height: undefined, quality: undefined }),
			).toBe("a.webp")
		})

		it(`gives distinct names to distinct requests`, () => {
			const names = [
				{ format: "webp", width: 100, height: undefined, quality: undefined },
				{ format: "webp", width: undefined, height: 100, quality: undefined },
				{ format: "webp", width: 100, height: undefined, quality: 80 },
				{ format: "avif", width: 100, height: undefined, quality: undefined },
			].map((directives) => getꓽderived__name("a.png", directives as ImageDirectives))

			expect(new Set(names).size).toBe(names.length)
		})
	})

	describe("getꓽformat()", () => {
		it(`normalizes aliases + casing to what sharp expects`, () => {
			expect(getꓽformat("jpg")).toBe("jpeg")
			expect(getꓽformat("JPEG")).toBe("jpeg")
			expect(getꓽformat("tif")).toBe("tiff")
		})

		it(`throws on an unsupported format`, () => {
			expect(() => getꓽformat("bmp")).toThrow()
		})
	})

	describe("getꓽextension()", () => {
		it(`reads the extension of a transformable image`, () => {
			expect(getꓽextension("a/b/original.PNG")).toBe("png")
		})

		it(`returns undefined for anything else`, () => {
			expect(getꓽextension("a/b/data.json")).toBeUndefined()
			expect(getꓽextension("a/b/noext")).toBeUndefined()
			expect(getꓽextension("a.b/noext")).toBeUndefined()
		})
	})
})

/////////////////////////////////////////////////

import { describe, expect, it } from "vitest"

import {
	type ImageDirectives,
	getꓽderived__name,
	getꓽextension,
	getꓽformat,
	parseꓽdirectives,
	parseꓽimage_references,
} from "./image-directives.ts"
