import { ImportedPackageType } from "parse-imports-ts"
import { describe, expect, it } from "vitest"

import { assert_from, assert } from "@monorepo-private/assert"

import { parseꓽimported_packages } from "./parse-imports.ts"

/////////////////////////////////////////////////

describe(`${parseꓽimported_packages.name}()`, () => {
	it(`drops a bundler query from a bare package import`, () => {
		expect(
			parseꓽimported_packages(`
				import url from "@scope/pkg?url"
				import raw from "unscoped?raw#hash"
			`),
		).toEqual([
			{ name: "@scope/pkg", type: ImportedPackageType.NormalImport },
			{ name: "unscoped", type: ImportedPackageType.NormalImport },
		])
	})

	it(`drops a bundler query from a deep import`, () => {
		expect(parseꓽimported_packages(`import url from "@scope/pkg/file.css?url"`)).toEqual([
			{ name: "@scope/pkg", type: ImportedPackageType.NormalImport },
		])
	})

	it(`merges the queried and non-queried imports of the same package, a normal import winning`, () => {
		expect(
			parseꓽimported_packages(`
				import type { Foo } from "@scope/pkg"
				import url from "@scope/pkg?url"
			`),
		).toEqual([{ name: "@scope/pkg", type: ImportedPackageType.NormalImport }])
	})

	it(`keeps type-only imports as such`, () => {
		expect(
			parseꓽimported_packages(`
				import type { Foo } from "@scope/pkg"
				import type { Bar } from "@scope/pkg/sub"
			`),
		).toEqual([{ name: "@scope/pkg", type: ImportedPackageType.TypeImport }])
	})

	it(`ignores relative imports, queried or not`, () => {
		expect(
			parseꓽimported_packages(`
				import "./index.css?inline"
				import foo from "../foo.ts"
			`),
		).toEqual([])
	})
})
