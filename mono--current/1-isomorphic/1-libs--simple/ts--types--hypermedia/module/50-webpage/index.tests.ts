import { expect } from "chai"

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

describe(`Web types -- webpage`, function () {
	describe("selectors", function () {
		it("should work -- empty = defaults", () => {
			const spec: Contentⳇweb = {}

			expect(getꓽlang(spec)).to.deep.equal("en")
			expect(getꓽcharset(spec)).to.deep.equal("utf-8")

			expect(getꓽhtml(spec)).to.deep.equal([])
			expect(getꓽhtml__root__attributes(spec)).to.deep.equal([])

			expect(getꓽcss(spec)).to.deep.equal([])
			expect(getꓽcssⵧtop__layers(spec)).to.deep.equal([])
			expect(getꓽcssⵧtop__namespaces(spec)).to.deep.equal({})
			expect(getꓽcssⵧcritical(spec)).to.deep.equal([])

			expect(getꓽjs(spec)).to.deep.equal([])
			expect(getꓽjsⵧcritical(spec)).to.deep.equal([])

			expect(getꓽtitle(spec), "title").to.be.undefined
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

			expect(getꓽlang(spec)).to.deep.equal("en")
			expect(getꓽcharset(spec)).to.deep.equal("utf-8")

			expect(getꓽhtml(spec)).to.deep.equal(["<p>hello, World!</p>"])
			expect(getꓽhtml__root__attributes(spec)).to.deep.equal([`.class1`, `data-o-theme="dark"`])

			expect(getꓽcss(spec)).to.deep.equal(["body { padding: 1em; }"])
			expect(getꓽcssⵧtop__layers(spec)).to.deep.equal(["reset", "base"])
			expect(getꓽcssⵧtop__namespaces(spec)).to.deep.equal({
				svg: "http://www.w3.org/2000/svg",
			})
			expect(getꓽcssⵧcritical(spec)).to.deep.equal(["body { color: red; }"])

			expect(getꓽjs(spec)).to.deep.equal(["console.log('hello, World!');"])
			expect(getꓽjsⵧcritical(spec)).to.deep.equal([])

			expect(getꓽtitle(spec), "title").to.equal("The Boring RPG")
		})
	})
})
