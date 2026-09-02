import * as path from "node:path"
import { fileURLToPath } from "node:url"

import { expect } from "chai"

import { createꓽfile_entry } from "./index.ts"

/////////////////////////////////////////////////

describe(`@monorepo-private/file-entry -- examples`, function () {
	const dirname = path.dirname(fileURLToPath(import.meta.url))
	const root = path.resolve(dirname, "../..")

	describe("createꓽfile_entry(…)", function () {
		it("should work -- simple file", () => {
			const out = createꓽfile_entry(path.resolve(dirname, "./index.ts"), root)
			expect(out).to.deep.equal({
				basename: "index.ts",

				ext: ".ts",
				basename‿no_ᐧext: "index",

				extⵧsub: "",
				extⵧextended: ".ts",
				basename‿no_ᐧxᐧext: "index",

				basenameⵧsemantic‿no_ᐧext: "src",

				path‿abs: root + "/module/src/index.ts",
				path‿rel: "module/src/index.ts",
				root‿abspath: root,
			})
		})

		it("should work -- double extension", () => {
			const out = createꓽfile_entry(path.resolve(dirname, "./index.tests.ts"), root)
			expect(out).to.deep.equal({
				basename: "index.tests.ts",

				ext: ".ts",
				basename‿no_ᐧext: "index.tests",

				extⵧsub: ".tests",
				extⵧextended: ".tests.ts",
				basename‿no_ᐧxᐧext: "index",

				basenameⵧsemantic‿no_ᐧext: "index.tests",

				path‿abs: root + "/module/src/index.tests.ts",
				path‿rel: "module/src/index.tests.ts",
				root‿abspath: root,
			})
		})

		it("should work -- dotfile", () => {
			const out = createꓽfile_entry(path.resolve(dirname, "./.nojekyll"), root)
			expect(out).to.deep.equal({
				basename: ".nojekyll",

				ext: "",
				basename‿no_ᐧext: ".nojekyll",

				extⵧsub: "",
				extⵧextended: ".nojekyll",
				basename‿no_ᐧxᐧext: ".nojekyll",

				basenameⵧsemantic‿no_ᐧext: ".nojekyll",

				path‿abs: root + "/module/src/.nojekyll",
				path‿rel: "module/src/.nojekyll",
				root‿abspath: root,
			})
		})
	})
})
