import { describe, it, expect } from "vitest"

import { findꓽvirtual_store_entry, pickꓽversionⵧlocked, type PnpmLockfile } from "./utils--pnpm.ts"

describe("@infinite-monorepo/pkg-infos-resolver — local pnpm", () => {
	const lockfile: PnpmLockfile = {
		catalogs: {
			default: {
				semver: { specifier: "^7", version: "7.8.5" },
				"@parcel/plugin": { specifier: "^2", version: "2.16.4(@parcel/core@2.16.4)" },
			},
		},
		packages: {
			"semver@5.7.2": {},
			"semver@7.8.5": {},
			"semver@7.9.0": {},
			"@types/node@22.10.0": {},
			"@types/node@24.1.0": {},
			"@types/node@26.6.4": {},
			"@parcel/plugin@2.16.4": {},
			"some-git-dep@git+ssh://git@github.com/foo/bar.git#abcdef": {},
		},
	}

	describe("pickꓽversionⵧlocked()", () => {
		it("prefers the catalog version over a higher locked one", () => {
			expect(pickꓽversionⵧlocked(lockfile, "semver", undefined)).toBe("7.8.5")
		})

		it("strips the peers suffix of catalog versions", () => {
			expect(pickꓽversionⵧlocked(lockfile, "@parcel/plugin", undefined)).toBe("2.16.4")
		})

		it("falls back to the highest locked version satisfying the range", () => {
			expect(pickꓽversionⵧlocked(lockfile, "@types/node", undefined)).toBe("26.6.4")
			expect(pickꓽversionⵧlocked(lockfile, "@types/node", "^24")).toBe("24.1.0")
			expect(pickꓽversionⵧlocked(lockfile, "semver", "^5")).toBe("5.7.2")
		})

		it("returns undefined when nothing suitable is locked", () => {
			expect(pickꓽversionⵧlocked(lockfile, "@types/node", "^25")).toBeUndefined()
			expect(pickꓽversionⵧlocked(lockfile, "unknown-pkg", undefined)).toBeUndefined()
			expect(pickꓽversionⵧlocked(lockfile, "some-git-dep", undefined)).toBeUndefined()
			expect(pickꓽversionⵧlocked({}, "semver", undefined)).toBeUndefined()
		})
	})

	describe("findꓽvirtual_store_entry()", () => {
		const entries = ["semver@7.8.5", "semver@7.8.50", "@types+node@24.1.0", "@devframes+agentic@1.2.0_crossws@0.4.12"]

		it("matches pnpm's virtual store dir naming", () => {
			expect(findꓽvirtual_store_entry(entries, "semver", "7.8.5")).toBe("semver@7.8.5")
			expect(findꓽvirtual_store_entry(entries, "@types/node", "24.1.0")).toBe("@types+node@24.1.0")
			expect(findꓽvirtual_store_entry(entries, "@devframes/agentic", "1.2.0")).toBe(
				"@devframes+agentic@1.2.0_crossws@0.4.12",
			)
		})

		it("returns undefined when absent", () => {
			expect(findꓽvirtual_store_entry(entries, "semver", "7.8")).toBeUndefined()
		})
	})
})
