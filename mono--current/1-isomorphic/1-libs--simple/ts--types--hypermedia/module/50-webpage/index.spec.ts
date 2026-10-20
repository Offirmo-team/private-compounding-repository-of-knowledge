import { describe, it, expect } from "vitest"

import { getꓽtitle, getꓽlang, getꓽcharset } from "../index.ts"

import {
	type Contentⳇweb,
	getꓽhtml,
	getꓽhtml__root__attributes,
	getꓽcssⵧcritical,
	getꓽcss,
	getꓽcssⵧtop__layers,
	getꓽcssⵧtop__namespaces,
	getꓽjsⵧcritical,
	getꓽjs,
} from "./index.ts"

/////////////////////////////////////////////////

describe(`Web types -- webpage`, () => {
	describe("selectors", () => {
		it("should work -- empty = defaults", () => {
			const spec: Contentⳇweb = {}

			expect(getꓽlang(spec)).toBe("en")
			expect(getꓽcharset(spec)).toBe("utf-8")

			expect(getꓽhtml(spec)).toStrictEqual([])
			expect(getꓽhtml__root__attributes(spec)).toStrictEqual([])

			expect(getꓽcss(spec)).toStrictEqual([])
			expect(getꓽcssⵧtop__layers(spec)).toStrictEqual([])
			expect(getꓽcssⵧtop__namespaces(spec)).toStrictEqual({})
			expect(getꓽcssⵧcritical(spec)).toStrictEqual([])

			expect(getꓽjs(spec)).toStrictEqual([])
			expect(getꓽjsⵧcritical(spec)).toStrictEqual([])

			expect(getꓽtitle(spec), "title").toBeUndefined()
		})

		it("should work -- NOT empty = NOT default", () => {
			const spec: Contentⳇweb = {
				title: "The Boring RPG",

				html: [`<p>hello, World!</p>`],
				html__root__attributes: [`.class1`, `.class1`, `data-o-theme="dark"`],

				css: [`body { padding: 1em; }`],
				cssⵧtop__namespaces: { svg: "http://www.w3.org/2000/svg" },
				cssⵧtop__layers: ["reset", "base"],
				js: [`console.log('hello, World!');`],
				cssⵧcritical: [`body { color: red; }`],
				jsⵧcritical: [],
			}

			expect(getꓽlang(spec)).toBe("en")
			expect(getꓽcharset(spec)).toBe("utf-8")

			expect(getꓽhtml(spec)).toStrictEqual(["<p>hello, World!</p>"])
			expect(getꓽhtml__root__attributes(spec)).toStrictEqual([`.class1`, `data-o-theme="dark"`])

			expect(getꓽcss(spec)).toStrictEqual(["body { padding: 1em; }"])
			expect(getꓽcssⵧtop__layers(spec)).toStrictEqual(["reset", "base"])
			expect(getꓽcssⵧtop__namespaces(spec)).toStrictEqual({
				svg: "http://www.w3.org/2000/svg",
			})
			expect(getꓽcssⵧcritical(spec)).toStrictEqual(["body { color: red; }"])

			expect(getꓽjs(spec)).toStrictEqual(["console.log('hello, World!');"])
			expect(getꓽjsⵧcritical(spec)).toStrictEqual([])

			expect(getꓽtitle(spec), "title").toBe("The Boring RPG")
		})
	})
})
