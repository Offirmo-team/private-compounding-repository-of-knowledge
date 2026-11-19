/////////////////////////////////////////////////

describe("@infinite-monorepo/operation--resurrect -- selectors", () => {
	describe("getꓽzones()", () => {
		it("should group the consecutive packages of the same subgroup", () => {
			const packages = [
				_createꓽpackage("1-g/1-sg/a/"),
				_createꓽpackage("1-g/1-sg/b/"),
				_createꓽpackage("1-g/2-sg/c/", { precedence_subgroup: 2 }),
				_createꓽpackage("S-skus/@a/x/", { precedence_group: 99, precedence_subgroup: 0, sku: "@a" }),
			]

			expect(getꓽzones(packages).map((zone) => zone.map((p) => getꓽzone_id(p)))).toEqual([
				["1.1", "1.1"],
				["1.2"],
				["99.0"],
			])
		})
	})

	describe("formatꓽzone_header()", () => {
		it("should display the group name when it changes, then the subgroup name", () => {
			const a = _createꓽpackage("1-isomorphic/1-libs--simple/a/")
			const b = _createꓽpackage("1-isomorphic/2-libs--cross-cutting/b/", { precedence_subgroup: 2 })
			const x = _createꓽpackage("S-skus/@tbrpg/x/", { precedence_group: 99, precedence_subgroup: 3, sku: "@tbrpg" })

			const widths = { name: 0, id: 0 }

			expect(stripVTControlCharacters(formatꓽzone_header([a], undefined, widths))).toBe(
				"\n1-isomorphic/\n  1-libs--simple/ 1.1 ",
			)
			expect(stripVTControlCharacters(formatꓽzone_header([b], [a], widths))).toBe("\n  2-libs--cross-cutting/ 1.2 ")
			expect(stripVTControlCharacters(formatꓽzone_header([x], [b], widths))).toBe("\nS-skus/\n  @tbrpg/ 99.3 ")
		})

		it("should fall back to the group name when there is no subgroup", () => {
			const a = _createꓽpackage("0-meta/config--mocha/", { precedence_group: 0, precedence_subgroup: 99 })

			expect(stripVTControlCharacters(formatꓽzone_header([a], undefined, { name: 0, id: 0 }))).toBe(
				"\n0-meta/\n  0-meta/ 0.99 ",
			)
		})

		it("should align all the dots, across all the zones", () => {
			const a = _createꓽpackage("1-isomorphic/1-libs--simple/a/")
			const x = _createꓽpackage("S-skus/@tbrpg/x/", { precedence_group: 99, precedence_subgroup: 13, sku: "@tbrpg" })
			const widths = getꓽzone_header_widths([[a], [x]])

			expect(widths).toEqual({ name: "1-libs--simple/".length, id: "99.13".length })
			expect(stripVTControlCharacters(formatꓽzone_header([a], [x], widths))).toBe(
				"\n1-isomorphic/\n  1-libs--simple/ 1.1   ",
			)
			expect(stripVTControlCharacters(formatꓽzone_header([x], [a], widths))).toBe(
				"\nS-skus/\n          @tbrpg/ 99.13 ",
			)
		})
	})

	describe("isꓽin_incubator()", () => {
		it("should detect the incubator packages", () => {
			expect(isꓽin_incubator(_createꓽpackage("1-isomorphic/1-libs--simple/a/"))).toBe(false)
			expect(isꓽin_incubator(_createꓽpackage("1-isomorphic/X-incubator/active/a/"))).toBe(true)
		})
	})

	describe("--from", () => {
		it("should skip the zones strictly before", () => {
			const pkg = _createꓽpackage("1-isomorphic/1-libs--simple/a/", { precedence_group: 1, precedence_subgroup: 2 })

			expect(isꓽbefore(pkg, parseꓽfrom("1.3"))).toBe(true)
			expect(isꓽbefore(pkg, parseꓽfrom("1.2"))).toBe(false) // included
			expect(isꓽbefore(pkg, parseꓽfrom("1"))).toBe(false)
			expect(isꓽbefore(pkg, parseꓽfrom("2"))).toBe(true)
			expect(isꓽbefore(pkg, [])).toBe(false) // no --from
		})

		it("should reject a malformed value", () => {
			expect(() => parseꓽfrom("1.2.3")).toThrow("--from")
			expect(() => parseꓽfrom("foo")).toThrow("--from")
		})
	})

	describe("formatꓽdot()", () => {
		it("should color the dot by status", () => {
			const color = (...args: Parameters<typeof formatꓽdot>) => formatꓽdot(...args).replace("●", "X")

			expect(color(0, { isꓽactive: true, isꓽblocking: true })).toBe(styleText("green", "X"))
			expect(color(1, { isꓽactive: true, isꓽblocking: true })).toBe(styleText("red", "X"))
			expect(color(1, { isꓽactive: true, isꓽblocking: false })).toBe(styleText("yellow", "X"))
			expect(color(0, { isꓽactive: false, isꓽblocking: true })).toBe(styleText("gray", "X"))
			expect(color(1, { isꓽactive: false, isꓽblocking: false })).toBe(styleText("red", "X")) // known issues
		})
	})

	describe("getꓽscripts_to_run()", () => {
		it("should select only the check:* scripts, sorted", () => {
			const scripts = {
				"check:unit-tests": "run-s test",
				check: "run-s check:ts check:unit-tests", // aggregate = would run everything twice
				test: "run-s test--vitest", // covered by check:unit-tests
				"check:ts": 'echo "foo" && tsc --noEmit',
				dev: "run-s watch:check:ts",
			}

			expect(getꓽscripts_to_run(scripts)).toEqual(["check:ts", "check:unit-tests"])
		})

		it("should handle a package without scripts", () => {
			expect(getꓽscripts_to_run(undefined)).toEqual([])
		})
	})

	describe("formatꓽreport()", () => {
		it("should congratulate when nothing to fix", () => {
			expect(stripVTControlCharacters(formatꓽreport([], []))).toContain("nothing to fix")
		})

		it("should list the blocking packages first, each with its zone, path and issues", () => {
			const a = _createꓽpackage("1-isomorphic/1-libs--simple/a/", { fqname: "@test/a" })
			const b = _createꓽpackage("1-isomorphic/1-libs--simple/b/", { fqname: "@test/b" })
			const phantom: PackageGraphⳇPackageⵧphantom = {
				isꓽphantom: true,
				fqname: "@test/phantom",
				precedence_group: 1,
				precedence_subgroup: 1,
				precedence_pkg: 5,
				sibling_deps_count: 0,
				monorepo_deps_count: 0,
				layer: 0,
				isꓽpublic: false,
			}

			const report = stripVTControlCharacters(
				formatꓽreport(
					[
						{
							pkg: a,
							issues: [{ source: "script", script: "check:ts", log‿rel: ".monorepo/resurrect--check--ts.log" }],
							isꓽblocking: false,
						},
						{
							pkg: phantom,
							issues: [
								{
									source: "graph",
									issue: { type: "missing_package", dependents: ["@test/b"], message: "needed by @test/b" },
								},
							],
							isꓽblocking: true,
						},
						{
							pkg: b,
							issues: [
								{
									source: "graph",
									issue: {
										type: "dep_cycle",
										peers: ["@test/a"],
										message: "in a dependency cycle with @test/a",
									},
								},
							],
							isꓽblocking: true,
						},
					],
					getꓽzones([phantom, a, b]),
				),
			)

			expect(report).toBe(
				[
					"✖ next package(s) to fix, in this order:",
					"",
					"1. 1.1 > 1-libs--simple/ > @test/phantom [1.1.5.0]",
					"   (phantom = missing from the packages list)",
					"   - [graph] missing_package: needed by @test/b",
					"",
					"2. 1.1 > 1-libs--simple/ > @test/b [1.1.5.0]",
					"   1-isomorphic/1-libs--simple/b/",
					"   - [graph] dep_cycle: in a dependency cycle with @test/a",
					"",
					"3. 1.1 > 1-libs--simple/ > @test/a (not blocking) [1.1.5.0]",
					"   1-isomorphic/1-libs--simple/a/",
					"   - [check:ts] failed, see .monorepo/resurrect--check--ts.log",
				].join("\n"),
			)
		})
	})
})

/////////////////////////////////////////////////

function _createꓽpackage(
	path‿rel: DirPathⳇRelative,
	overrides: Partial<PackageGraphⳇPackageⵧreal> = {},
): PackageGraphⳇPackageⵧreal {
	return {
		isꓽphantom: false,
		fqname: `@test/${path‿rel}`,
		path‿rel,
		precedence_group: 1,
		precedence_subgroup: 1,
		precedence_pkg: 5,
		sibling_deps_count: 5,
		monorepo_deps_count: 5,
		layer: 0,
		isꓽpublic: false,
		...overrides,
	}
}

/////////////////////////////////////////////////

import { stripVTControlCharacters, styleText } from "node:util"

import type { PackageGraphⳇPackageⵧphantom, PackageGraphⳇPackageⵧreal } from "@infinite-monorepo/plugin--graph"
import { describe, it, expect } from "vitest"

import type { DirPathⳇRelative } from "@monorepo-private/ts--types"

import {
	formatꓽdot,
	formatꓽreport,
	formatꓽzone_header,
	getꓽscripts_to_run,
	getꓽzone_header_widths,
	getꓽzone_id,
	getꓽzones,
	isꓽbefore,
	isꓽin_incubator,
	parseꓽfrom,
} from "./selectors.ts"
