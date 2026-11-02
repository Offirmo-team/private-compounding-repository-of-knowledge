/////////////////////////////////////////////////

// in priority order
const CRITERIA: Array<{ better: Partial<PackageGraphⳇPackageⵧreal>; worse: Partial<PackageGraphⳇPackageⵧreal> }> = [
	{ better: { precedence_group: 0 }, worse: { precedence_group: 1 } },
	{ better: { precedence_subgroup: 0 }, worse: { precedence_subgroup: 1 } },
	{ better: { precedence_pkg: 0 }, worse: { precedence_pkg: 1 } },
	{ better: { layer: 0 }, worse: { layer: 1 } },
	{ better: { sibling_deps_count: 0 }, worse: { sibling_deps_count: 1 } },
	{ better: { monorepo_deps_count: 0 }, worse: { monorepo_deps_count: 1 } },
	{ better: { isꓽpublic: true }, worse: { isꓽpublic: false } },
]

describe("@infinite-monorepo/plugin--graph -- utils", () => {
	describe("sortꓽpackages()", () => {
		CRITERIA.forEach(({ better, worse }, index) => {
			const following = CRITERIA.slice(index + 1)

			it(`should sort by ${Object.keys(better)[0]}, with priority over the next criteria and the path`, () => {
				// "better" on this criterion but worse on all the following ones + the path
				const pkgⵧbetter = _createꓽpackage("z/", {
					...better,
					...Object.assign({}, ...following.map((c) => c.worse)),
				})
				const pkgⵧworse = _createꓽpackage("a/", {
					...worse,
					...Object.assign({}, ...following.map((c) => c.better)),
				})

				expect(sortꓽpackages([pkgⵧworse, pkgⵧbetter])).toEqual([pkgⵧbetter, pkgⵧworse])
			})
		})

		it("should finally sort by path", () => {
			const packages = [_createꓽpackage("b/"), _createꓽpackage("a/b/"), _createꓽpackage("a/")]

			expect(_getꓽpaths(sortꓽpackages(packages))).toEqual(["a/", "a/b/", "b/"])
		})

		it("should not mutate its input", () => {
			const packages = [_createꓽpackage("b/"), _createꓽpackage("a/")]

			const sorted = sortꓽpackages(packages)

			expect(sorted).not.toBe(packages)
			expect(packages.map((p) => p.path‿rel)).toEqual(["b/", "a/"])
		})

		it("should place the phantoms first among exact ties", () => {
			const packages = [_createꓽpackage("a/"), _createꓽphantom("@test/missing/")]

			expect(_getꓽpaths(sortꓽpackages(packages))).toEqual(["(phantom)", "a/"])
		})
	})
})

/////////////////////////////////////////////////

function _getꓽpaths(packages: Array<Immutable<PackageGraphⳇPackage>>): Array<string> {
	return packages.map((p) => (p.isꓽphantom ? "(phantom)" : p.path‿rel))
}

function _createꓽphantom(fqname: PkgFQName): PackageGraphⳇPackageⵧphantom {
	return {
		isꓽphantom: true,
		fqname,
		precedence_group: 5,
		precedence_subgroup: 5,
		precedence_pkg: 5,
		sibling_deps_count: 5,
		monorepo_deps_count: 5,
		layer: 5,
		isꓽpublic: false,
	}
}

function _createꓽpackage(
	path‿rel: DirPathⳇRelative,
	overrides: Partial<PackageGraphⳇPackageⵧreal> = {},
): PackageGraphⳇPackageⵧreal {
	return {
		isꓽphantom: false,
		fqname: `@test/${path‿rel}`,
		path‿rel,
		precedence_group: 5,
		precedence_subgroup: 5,
		precedence_pkg: 5,
		sibling_deps_count: 5,
		monorepo_deps_count: 5,
		layer: 5,
		isꓽpublic: false,
		...overrides,
	}
}

/////////////////////////////////////////////////

import type { PkgFQName } from "@infinite-monorepo/types-for-plugins"
import { describe, it, expect } from "vitest"

import type { DirPathⳇRelative, Immutable } from "@monorepo-private/ts--types"

import type { PackageGraphⳇPackage, PackageGraphⳇPackageⵧphantom, PackageGraphⳇPackageⵧreal } from "./types.ts"
import { sortꓽpackages } from "./utils.ts"
