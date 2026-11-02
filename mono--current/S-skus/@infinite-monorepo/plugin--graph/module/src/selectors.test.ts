/////////////////////////////////////////////////

const MONOREPO_ROOT‿abs: DirPathⳇAbsolute = "/home/user/monorepo/"
const isꓽmonorepo_package: IsꓽMonorepoPackage = (fqname) =>
	fqname.startsWith("@monorepo-private/") || fqname.startsWith("@infinite-monorepo/")

describe("@infinite-monorepo/plugin--graph -- selectors", () => {
	describe("deriveꓽprecedence_group()", () => {
		it("should return the leading number of the top folder", () => {
			expect(deriveꓽprecedence_group("0-meta/scripts/")).toBe(0)
			expect(deriveꓽprecedence_group("1-isomorphic/1-libs--simple/0-assert/")).toBe(1)
			expect(deriveꓽprecedence_group("12-future/foo/")).toBe(12)
		})

		it("should default to the SKU slice when the top folder is not numbered", () => {
			expect(PRECEDENCE_GROUPⵧSKU).toBe(99)
			expect(deriveꓽprecedence_group("S-skus/@infinite-monorepo/01-known-versions/")).toBe(PRECEDENCE_GROUPⵧSKU)
			expect(deriveꓽprecedence_group("B-backend/foo/")).toBe(PRECEDENCE_GROUPⵧSKU)
			expect(deriveꓽprecedence_group("42/foo/")).toBe(PRECEDENCE_GROUPⵧSKU)
		})
	})

	describe("deriveꓽprecedence_subgroup()", () => {
		it("should return the leading number of the 2nd folder", () => {
			expect(deriveꓽprecedence_subgroup("1-isomorphic/1-libs--simple/0-freeze/")).toBe(1)
			expect(deriveꓽprecedence_subgroup("1-isomorphic/2-libs--cross-cutting/foo/")).toBe(2)
			expect(deriveꓽprecedence_subgroup("3-engine--node/0-dev-tools/foo/")).toBe(0)
		})

		it("should default when the 2nd folder is not numbered", () => {
			expect(PRECEDENCE_SUBGROUPⵧDEFAULT).toBe(99)
			expect(deriveꓽprecedence_subgroup("1-isomorphic/X-incubator/active/foo/")).toBe(PRECEDENCE_SUBGROUPⵧDEFAULT)
			expect(deriveꓽprecedence_subgroup("S-skus/@infinite-monorepo/43-spec--load/")).toBe(
				PRECEDENCE_SUBGROUPⵧDEFAULT,
			)
		})

		it("should default when the 2nd folder is the package folder itself", () => {
			expect(deriveꓽprecedence_subgroup("0-meta/scripts/")).toBe(PRECEDENCE_SUBGROUPⵧDEFAULT)
			expect(deriveꓽprecedence_subgroup("1-isomorphic/0-foo/")).toBe(PRECEDENCE_SUBGROUPⵧDEFAULT)
		})
	})

	describe("deriveꓽprecedence_pkg()", () => {
		it("should return the leading number of the package folder", () => {
			expect(deriveꓽprecedence_pkg("1-isomorphic/1-libs--simple/0-freeze/")).toBe(0)
			expect(deriveꓽprecedence_pkg("S-skus/@infinite-monorepo/43-spec--load/")).toBe(43)
		})

		it("should default when the package folder is not numbered", () => {
			expect(PRECEDENCE_PKGⵧDEFAULT).toBe(999)
			expect(deriveꓽprecedence_pkg("0-meta/scripts/")).toBe(PRECEDENCE_PKGⵧDEFAULT)
			expect(deriveꓽprecedence_pkg("S-skus/@tbrpg/1-logic/l1-foo/")).toBe(PRECEDENCE_PKGⵧDEFAULT)
			expect(deriveꓽprecedence_pkg("S-skus/@infinite-monorepo/plugin--graph/")).toBe(PRECEDENCE_PKGⵧDEFAULT)
		})
	})

	describe("deriveꓽsku()", () => {
		it("should return the folder right under the SKUs folder", () => {
			expect(deriveꓽsku("S-skus/@infinite-monorepo/19-graph/")).toBe("@infinite-monorepo")
			expect(deriveꓽsku("S-skus/@tbrpg/1-logic/l1-foo/")).toBe("@tbrpg")
			expect(deriveꓽsku("S-skus/single-pkg/")).toBe("single-pkg")
		})

		it("should return undefined when not in the SKUs folder", () => {
			expect(deriveꓽsku("1-isomorphic/1-libs--simple/0-assert/")).toBeUndefined()
			expect(deriveꓽsku("7-multimorphic/@oh-my-rpg/foo/")).toBeUndefined()
			expect(deriveꓽsku("S-skus/")).toBeUndefined()
		})
	})

	describe("deriveꓽdeps()", () => {
		it("should list all the deps, ordered by type then fqname, flagging the monorepo ones", () => {
			const node = _createꓽnodeⵧpackage("1-isomorphic/foo/", "@monorepo-private/foo", [
				["vitest", "dev"],
				["tslib", "peer"], // will also be added as dev
				["@monorepo-private/bar", "normal"],
				["@monorepo-private/assert", "normal"],
			])

			expect(deriveꓽdeps(node.details, isꓽmonorepo_package)).toEqual([
				{ fqname: "@monorepo-private/assert", type: "normal", isꓽmonorepo: true },
				{ fqname: "@monorepo-private/bar", type: "normal", isꓽmonorepo: true },
				{ fqname: "tslib", type: "peer", isꓽmonorepo: false },
				{ fqname: "tslib", type: "dev", isꓽmonorepo: false },
				{ fqname: "vitest", type: "dev", isꓽmonorepo: false },
			])
		})

		it("should return an empty list when no deps", () => {
			const node = _createꓽnodeⵧpackage("0-meta/foo/", "@monorepo-private/foo")

			expect(deriveꓽdeps(node.details, isꓽmonorepo_package)).toEqual([])
		})
	})

	describe("deriveꓽmonorepo_deps_count()", () => {
		it("should count the distinct monorepo deps", () => {
			const node = _createꓽnodeⵧpackage("1-isomorphic/foo/", "@monorepo-private/foo", [
				["@monorepo-private/soft-execution-context", "peer"], // will also be added as dev = counted once
				["@monorepo-private/assert", "normal"],
				["@monorepo-private/scripts", "dev"],
				["tslib", "peer"], // external
				["vitest", "dev"], // external
			])

			expect(deriveꓽmonorepo_deps_count(deriveꓽdeps(node.details, isꓽmonorepo_package))).toBe(3)
		})

		it("should return 0 when no monorepo deps", () => {
			expect(deriveꓽmonorepo_deps_count([])).toBe(0)
			expect(deriveꓽmonorepo_deps_count([{ fqname: "tslib", type: "peer", isꓽmonorepo: false }])).toBe(0)
		})
	})

	describe("deriveꓽlayer_by_fqname()", () => {
		it("should place the deps in earlier layers, within the same explicit precedence", () => {
			const packages = [
				_createꓽpackageⵧwithout_layer("a/", { deps: _depsⵧmonorepo("@test/b/") }),
				_createꓽpackageⵧwithout_layer("b/", { deps: _depsⵧmonorepo("@test/c/") }),
				_createꓽpackageⵧwithout_layer("c/"),
			]

			expect(_getꓽlayer_by_path(packages)).toEqual({ "a/": 2, "b/": 1, "c/": 0 })
		})

		it("should put ALL the ready packages in the same layer, whatever the tie-breaks", () => {
			const packages = [
				_createꓽpackageⵧwithout_layer("a/", { sibling_deps_count: 0 }),
				_createꓽpackageⵧwithout_layer("b/", { sibling_deps_count: 1, deps: _depsⵧmonorepo("@test/a/") }),
				_createꓽpackageⵧwithout_layer("c/", { sibling_deps_count: 2 }),
			]

			expect(_getꓽlayer_by_path(packages)).toEqual({ "a/": 0, "b/": 1, "c/": 0 })
		})

		it("should NOT let a dep across precedence chunks create a layer (specification)", () => {
			const packages = [
				_createꓽpackageⵧwithout_layer("a/", { precedence_group: 0, deps: _depsⵧmonorepo("@test/b/") }), // violation, reported as an issue
				_createꓽpackageⵧwithout_layer("b/", { precedence_group: 1, deps: _depsⵧmonorepo("@test/c/") }), // earlier chunk = already placed
				_createꓽpackageⵧwithout_layer("c/", { precedence_group: 0 }),
			]

			expect(_getꓽlayer_by_path(packages)).toEqual({ "a/": 0, "b/": 0, "c/": 0 })
		})

		it("should force the first remaining package by tie-breaks into a layer of its own in case of cycle", () => {
			const packages = [
				_createꓽpackageⵧwithout_layer("c/", { deps: _depsⵧmonorepo("@test/a/") }),
				_createꓽpackageⵧwithout_layer("b/", { deps: _depsⵧmonorepo("@test/a/") }),
				_createꓽpackageⵧwithout_layer("a/", { deps: _depsⵧmonorepo("@test/b/") }), // a ↔ b
			]

			expect(_getꓽlayer_by_path(packages)).toEqual({ "a/": 0, "b/": 1, "c/": 1 })
		})

		it("should place a phantom in an earlier layer than its dependents", () => {
			const phantom: PackageGraphⳇPackageⵧphantomⵧwithout_layer = {
				isꓽphantom: true,
				fqname: "@test/missing/",
				precedence_group: 5,
				precedence_subgroup: 5,
				precedence_pkg: 5,
				sibling_deps_count: 9, // worse tie-break on purpose: only the dep should matter
				monorepo_deps_count: 9,
				isꓽpublic: false,
			}
			const packages = [_createꓽpackageⵧwithout_layer("a/", { deps: _depsⵧmonorepo("@test/missing/") }), phantom]

			expect(Object.fromEntries(deriveꓽlayer_by_fqname(packages))).toEqual({ "@test/missing/": 0, "@test/a/": 1 })
		})

		it("should ignore the deps not in the list", () => {
			const packages = [_createꓽpackageⵧwithout_layer("a/", { deps: _depsⵧmonorepo("@test/unknown/") })]

			expect(_getꓽlayer_by_path(packages)).toEqual({ "a/": 0 })
		})
	})

	describe("deriveꓽsubgroup_by_sku()", () => {
		it("should order the SKUs by their deps on each other, then by name", () => {
			const nodes = [
				// the SKU comes from the folder
				_createꓽnodeⵧpackage("S-skus/@a/foo/", "@monorepo-private/a", [["@monorepo-private/z", "normal"]]), // @a → @z
				_createꓽnodeⵧpackage("S-skus/@b/foo/", "@monorepo-private/b"),
				_createꓽnodeⵧpackage("S-skus/@z/bar/", "@monorepo-private/z", [["@monorepo-private/assert", "normal"]]), // not a SKU
				_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/0-assert/", "@monorepo-private/assert"),
			]

			const packages = nodes.map((node) => deriveꓽpackage(node, MONOREPO_ROOT‿abs, isꓽmonorepo_package))

			expect(Object.fromEntries(deriveꓽsubgroup_by_sku(packages))).toEqual({ "@b": 0, "@z": 1, "@a": 2 })
		})

		it("should still order every SKU in case of cycle", () => {
			const nodes = [
				_createꓽnodeⵧpackage("S-skus/@b/foo/", "@monorepo-private/b", [["@monorepo-private/a", "normal"]]),
				_createꓽnodeⵧpackage("S-skus/@a/foo/", "@monorepo-private/a", [["@monorepo-private/b", "dev"]]), // @a ↔ @b
			]

			const packages = nodes.map((node) => deriveꓽpackage(node, MONOREPO_ROOT‿abs, isꓽmonorepo_package))

			expect(Object.fromEntries(deriveꓽsubgroup_by_sku(packages))).toEqual({ "@a": 0, "@b": 1 })
		})
	})

	describe("deriveꓽpackages()", () => {
		it("should derive one entry per package, sorted by path", () => {
			const nodes = [
				_createꓽnodeⵧpackage("S-skus/@infinite-monorepo/19-graph/", "@infinite-monorepo/graph", [
					["@monorepo-private/assert", "normal"],
				]),
				_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/0-assert/", "@monorepo-private/assert", [], {
					isꓽpublished: true,
				}),
				_createꓽnodeⵧpackage("0-meta/scripts/", "@monorepo-private/scripts"),
			]

			expect(deriveꓽpackages(nodes, MONOREPO_ROOT‿abs, isꓽmonorepo_package)).toEqual([
				{
					isꓽphantom: false,
					fqname: "@monorepo-private/scripts",
					path‿rel: "0-meta/scripts/",
					precedence_group: 0,
					precedence_subgroup: PRECEDENCE_SUBGROUPⵧDEFAULT,
					precedence_pkg: PRECEDENCE_PKGⵧDEFAULT,
					sibling_deps_count: 0,
					monorepo_deps_count: 0,
					layer: 0,
					isꓽpublic: false,
				},
				{
					isꓽphantom: false,
					fqname: "@monorepo-private/assert",
					path‿rel: "1-isomorphic/1-libs--simple/0-assert/",
					precedence_group: 1,
					precedence_subgroup: 1,
					precedence_pkg: 0,
					sibling_deps_count: 0,
					monorepo_deps_count: 0,
					layer: 0,
					isꓽpublic: true,
				},
				{
					isꓽphantom: false,
					fqname: "@infinite-monorepo/graph",
					path‿rel: "S-skus/@infinite-monorepo/19-graph/",
					precedence_group: PRECEDENCE_GROUPⵧSKU,
					precedence_subgroup: 0, // the 1st (and only) SKU
					precedence_pkg: 19,
					sibling_deps_count: 0,
					monorepo_deps_count: 1,
					layer: 0,
					sku: "@infinite-monorepo",
					isꓽpublic: false,
					deps: [{ fqname: "@monorepo-private/assert", type: "normal", isꓽmonorepo: true }],
				},
			])
		})

		it("should count the distinct siblings = listed packages with the same group AND subgroup", () => {
			const nodes = [
				_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/0-assert/", "@monorepo-private/assert"),
				_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/1-foo/", "@monorepo-private/foo", [
					["@monorepo-private/assert", "dev"],
				]),
				_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/2-bar/", "@monorepo-private/bar", [
					["@monorepo-private/scripts", "dev"], // lower group
					["tslib", "peer"], // external
				]),
				_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/3-qux/", "@monorepo-private/qux", [
					["@monorepo-private/assert", "peer"], // will also be added as dev = counted once
					["@monorepo-private/foo", "normal"],
				]),
				_createꓽnodeⵧpackage("1-isomorphic/2-libs--cross-cutting/baz/", "@monorepo-private/baz", [
					["@monorepo-private/assert", "normal"], // same group, lower subgroup
				]),
				_createꓽnodeⵧpackage("0-meta/scripts/", "@monorepo-private/scripts"),
			]

			const sibling_deps_count_by_fqname = Object.fromEntries(
				deriveꓽpackages(nodes, MONOREPO_ROOT‿abs, isꓽmonorepo_package).map((p) => [p.fqname, p.sibling_deps_count]),
			)
			expect(sibling_deps_count_by_fqname).toEqual({
				"@monorepo-private/assert": 0,
				"@monorepo-private/foo": 1,
				"@monorepo-private/bar": 0,
				"@monorepo-private/qux": 2,
				"@monorepo-private/baz": 0,
				"@monorepo-private/scripts": 0,
			})
		})

		describe("issues", () => {
			it("should report a monorepo dep missing from the packages list as a phantom, without crashing", () => {
				const nodes = [
					_createꓽnodeⵧpackage("3-engine--node/1-libs--simple/bar/", "@monorepo-private/bar", [
						["@monorepo-private/parked", "dev"],
					]),
					_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/0-assert/", "@monorepo-private/assert"),
					_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/1-foo/", "@monorepo-private/foo", [
						["@monorepo-private/assert", "normal"],
						["@monorepo-private/parked", "normal"],
					]),
				]

				const packages = deriveꓽpackages(nodes, MONOREPO_ROOT‿abs, isꓽmonorepo_package)

				// the dependents
				const foo = packages.find((p) => p.fqname === "@monorepo-private/foo")!
				expect(foo.issues).toEqual([
					{ type: "missing_dep", dep: "@monorepo-private/parked", message: expect.stringContaining("missing") },
				])
				expect(foo.sibling_deps_count).toBe(2) // assert + the phantom which inherited its precedence
				expect(packages.find((p) => p.fqname === "@monorepo-private/bar")!.issues).toEqual([
					{ type: "missing_dep", dep: "@monorepo-private/parked", message: expect.any(String) },
				])

				// the phantom: first, with the precedence of its earliest dependent (foo 1.1.1, not bar 3.1.999)
				expect(packages[0]).toEqual({
					isꓽphantom: true,
					fqname: "@monorepo-private/parked",
					precedence_group: 1,
					precedence_subgroup: 1,
					precedence_pkg: 1,
					sibling_deps_count: 0,
					monorepo_deps_count: 0,
					layer: 0,
					isꓽpublic: false,
					issues: [
						{
							type: "missing_package",
							dependents: ["@monorepo-private/bar", "@monorepo-private/foo"],
							message: expect.stringContaining("needed by 2 package(s)"),
						},
					],
				})
			})

			it("should report the monorepo deps coming later in the explicit order", () => {
				const nodes = [
					_createꓽnodeⵧpackage("0-meta/scripts/", "@monorepo-private/scripts"),
					_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/0-assert/", "@monorepo-private/assert", [
						["@monorepo-private/scripts", "dev"], // earlier group = ok
						["@monorepo-private/same", "normal"], // same explicit precedence = ok
						["@monorepo-private/baz", "normal"], // later subgroup = violation
						["@infinite-monorepo/apply", "dev"], // later group = violation
					]),
					_createꓽnodeⵧpackage("1-isomorphic/1-libs--simple/0-same/", "@monorepo-private/same"),
					_createꓽnodeⵧpackage("1-isomorphic/2-libs--cross-cutting/baz/", "@monorepo-private/baz"),
					_createꓽnodeⵧpackage("S-skus/@infinite-monorepo/70-apply/", "@infinite-monorepo/apply", [
						["@infinite-monorepo/plugin--foo", "normal"], // unnumbered = 999 = later = violation
					]),
					_createꓽnodeⵧpackage("S-skus/@infinite-monorepo/plugin--foo/", "@infinite-monorepo/plugin--foo"),
				]

				const issues_by_fqname = _getꓽissues_by_fqname(
					deriveꓽpackages(nodes, MONOREPO_ROOT‿abs, isꓽmonorepo_package),
				)

				expect(issues_by_fqname["@monorepo-private/assert"]).toEqual([
					{
						type: "precedence_violation",
						dep: "@infinite-monorepo/apply",
						message: expect.stringContaining("99.0.70 > 1.1.0"),
					},
					{
						type: "precedence_violation",
						dep: "@monorepo-private/baz",
						message: expect.stringContaining("1.2.999 > 1.1.0"),
					},
				])
				expect(issues_by_fqname["@infinite-monorepo/apply"]).toEqual([
					{ type: "precedence_violation", dep: "@infinite-monorepo/plugin--foo", message: expect.any(String) },
				])
				expect(issues_by_fqname["@monorepo-private/scripts"]).toEqual([])
			})

			it("should report the dependency cycles", () => {
				const nodes = [
					_createꓽnodeⵧpackage("1-isomorphic/a/", "@monorepo-private/a", [["@monorepo-private/b", "normal"]]),
					_createꓽnodeⵧpackage("1-isomorphic/b/", "@monorepo-private/b", [["@monorepo-private/c", "dev"]]),
					_createꓽnodeⵧpackage("1-isomorphic/c/", "@monorepo-private/c", [["@monorepo-private/a", "normal"]]),
					_createꓽnodeⵧpackage("1-isomorphic/d/", "@monorepo-private/d", [["@monorepo-private/a", "normal"]]), // depends on the cycle but not in it
				]

				const issues_by_fqname = _getꓽissues_by_fqname(
					deriveꓽpackages(nodes, MONOREPO_ROOT‿abs, isꓽmonorepo_package),
				)

				expect(issues_by_fqname["@monorepo-private/a"]).toEqual([
					{
						type: "dep_cycle",
						peers: ["@monorepo-private/b", "@monorepo-private/c"],
						message: expect.any(String),
					},
				])
				expect(issues_by_fqname["@monorepo-private/b"]).toEqual([
					{
						type: "dep_cycle",
						peers: ["@monorepo-private/a", "@monorepo-private/c"],
						message: expect.any(String),
					},
				])
				expect(issues_by_fqname["@monorepo-private/d"]).toEqual([])
			})
		})

		it("should reject a package outside the monorepo", () => {
			const node = {
				..._createꓽnodeⵧpackage("foo/", "foo"),
				path‿abs: "/elsewhere/foo/",
			} satisfies Immutable<NodeⳇPackage>

			expect(() => deriveꓽpackages([node], MONOREPO_ROOT‿abs, isꓽmonorepo_package)).toThrow(
				"Package expected inside the monorepo",
			)
		})
	})
})

/////////////////////////////////////////////////

function _getꓽissues_by_fqname(
	packages: Array<PackageGraphⳇPackage>,
): Record<PkgFQName, PackageGraphⳇPackage["issues"]> {
	return Object.fromEntries(packages.map((p) => [p.fqname, p.issues ?? []]))
}

function _getꓽlayer_by_path(
	packages: Array<Omit<PackageGraphⳇPackageⵧreal, "layer">>,
): Record<DirPathⳇRelative, number | undefined> {
	const layer_by_fqname = deriveꓽlayer_by_fqname(packages)

	return Object.fromEntries(packages.map((p) => [p.path‿rel, layer_by_fqname.get(p.fqname)]))
}

function _depsⵧmonorepo(...fqnames: Array<PkgFQName>): Array<PackageGraphⳇDependency> {
	return fqnames.map((fqname) => ({ fqname, type: "normal", isꓽmonorepo: true }))
}

function _createꓽpackageⵧwithout_layer(
	path‿rel: DirPathⳇRelative,
	overrides: Partial<Omit<PackageGraphⳇPackageⵧreal, "layer">> = {},
): Omit<PackageGraphⳇPackageⵧreal, "layer"> {
	return {
		isꓽphantom: false,
		fqname: `@test/${path‿rel}`,
		path‿rel,
		precedence_group: 5,
		precedence_subgroup: 5,
		precedence_pkg: 5,
		sibling_deps_count: 5,
		monorepo_deps_count: 5,
		isꓽpublic: false,
		...overrides,
	}
}

function _createꓽnodeⵧpackage(
	path‿rel: DirPathⳇRelative,
	fqname: PkgFQName,
	deps: Array<[PkgFQName, DependencyType]> = [],
	{ isꓽpublished = false } = {},
): Immutable<NodeⳇPackage> {
	const path‿abs: DirPathⳇAbsolute = `${MONOREPO_ROOT‿abs}${path‿rel}`

	const details = deps.reduce(
		(details, [dep_fqname, type]) => PkgDetailsLib.addꓽdependency(details, dep_fqname, { type }),
		{
			...PkgDetailsLib.create(path‿abs),
			fqname, // no need for name/namespace consistency, fqname is what we read
			isꓽpublished,
		},
	)

	return {
		type: "package",
		path‿abs,
		path‿ar: `${PATHVARⵧROOTⵧMONOREPO}/${path‿rel}`,
		parent_id: MONOREPO_ROOT‿abs,
		bfs_level: 1,
		plugin_area: {},
		details,
	}
}

/////////////////////////////////////////////////

import * as PkgDetailsLib from "@infinite-monorepo/package-details"
import {
	type DependencyType,
	type NodeⳇPackage,
	PATHVARⵧROOTⵧMONOREPO,
	type PkgFQName,
} from "@infinite-monorepo/types-for-plugins"
import { describe, it, expect } from "vitest"

import type { DirPathⳇAbsolute, DirPathⳇRelative, Immutable } from "@monorepo-private/ts--types"

import {
	type IsꓽMonorepoPackage,
	PRECEDENCE_PKGⵧDEFAULT,
	PRECEDENCE_GROUPⵧSKU,
	PRECEDENCE_SUBGROUPⵧDEFAULT,
	type PackageGraphⳇPackageⵧphantomⵧwithout_layer,
	deriveꓽdeps,
	deriveꓽlayer_by_fqname,
	deriveꓽpackage,
	deriveꓽsubgroup_by_sku,
	deriveꓽmonorepo_deps_count,
	deriveꓽprecedence_pkg,
	deriveꓽpackages,
	deriveꓽsku,
	deriveꓽprecedence_group,
	deriveꓽprecedence_subgroup,
} from "./selectors.ts"
import type { PackageGraphⳇDependency, PackageGraphⳇPackage, PackageGraphⳇPackageⵧreal } from "./types.ts"
