import { describe, it, expect, vi, beforeEach } from "vitest"

import { PkgInfosResolver } from "./index.ts"

const { ↆfetch_mock } = vi.hoisted(() => ({
	// "^1" -> 1.0.0, anything else -> 2.0.0 (types embedded = no extra @types/* retrieval)
	ↆfetch_mock: vi.fn(async (pkg_name: string, options: { version_specifier?: string }) => ({
		name: pkg_name,
		version: options.version_specifier === "^1" ? "1.0.0" : "2.0.0",
		types: "index.d.ts",
	})),
}))
vi.mock("./state/utils--network.ts", () => ({ ↆfetchꓽpackageᐧjsonⵧfrom_network: ↆfetch_mock }))

describe("@infinite-monorepo/pkg-infos-resolver — late constraints", () => {
	beforeEach(() => {
		ↆfetch_mock.mockClear()
	})

	describe("version override", () => {
		it("re-retrieves when declared after the retrieval started", async () => {
			const resolver = new PkgInfosResolver({ minimum_release_age‿minutes: 0 })
			resolver.preload("foo")
			resolver.declareꓽversion_override("foo", "^1")

			expect((await resolver.ↆgetꓽpackageᐧjson("foo")).version).toBe("1.0.0")
			expect(ↆfetch_mock).toHaveBeenCalledTimes(2)
			expect(ↆfetch_mock).toHaveBeenLastCalledWith("foo", expect.objectContaining({ version_specifier: "^1" }))
		})

		it("keeps an already retrieved version satisfying it", async () => {
			const resolver = new PkgInfosResolver({ minimum_release_age‿minutes: 0 })
			resolver.preload("foo")
			await resolver.ೱall_pending_loaded()
			resolver.declareꓽversion_override("foo", "^2")

			expect((await resolver.ↆgetꓽpackageᐧjson("foo")).version).toBe("2.0.0")
			expect(ↆfetch_mock).toHaveBeenCalledTimes(1)
		})

		it("throws when declared after an incompatible version was already used", async () => {
			const resolver = new PkgInfosResolver({ minimum_release_age‿minutes: 0 })
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(() => resolver.declareꓽversion_override("foo", "^1")).toThrow(/declared too late/)
		})

		it("is fine when declared after a compatible version was already used", async () => {
			const resolver = new PkgInfosResolver({ minimum_release_age‿minutes: 0 })
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(() => resolver.declareꓽversion_override("foo", "^2")).not.toThrow()
		})
	})

	describe("minimum release age", () => {
		it("is 0 = no constraint when not declared", async () => {
			const resolver = new PkgInfosResolver()
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(ↆfetch_mock).toHaveBeenLastCalledWith(
				"foo",
				expect.objectContaining({ minimum_release_age‿minutes: 0 }),
			)
		})

		it("re-retrieves everything when declared after retrievals started", async () => {
			const resolver = new PkgInfosResolver()
			resolver.preload("foo")
			resolver.preload("bar")
			resolver.declareꓽminimum_release_age(10080)
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(ↆfetch_mock).toHaveBeenCalledTimes(4)
			expect(ↆfetch_mock).toHaveBeenLastCalledWith(
				"bar",
				expect.objectContaining({ minimum_release_age‿minutes: 10080 }),
			)
		})

		it("doesn't re-retrieve when the declared value doesn't change anything", async () => {
			const resolver = new PkgInfosResolver()
			resolver.preload("foo")
			resolver.declareꓽminimum_release_age(0)
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(ↆfetch_mock).toHaveBeenCalledTimes(1)
		})

		it("accepts the same value declared again", async () => {
			const resolver = new PkgInfosResolver({ minimum_release_age‿minutes: 1440 })
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(() => resolver.declareꓽminimum_release_age(1440)).not.toThrow()
			expect(ↆfetch_mock).toHaveBeenCalledTimes(1)
		})

		it("crashes on a conflicting second declaration (init param included)", () => {
			const resolver = new PkgInfosResolver({ minimum_release_age‿minutes: 1440 })

			expect(() => resolver.declareꓽminimum_release_age(10080)).toThrow(/Conflicting/)
		})

		it("throws when declared after a package was already used", async () => {
			const resolver = new PkgInfosResolver()
			await resolver.ↆgetꓽpackageᐧjson("foo")

			expect(() => resolver.declareꓽminimum_release_age(10080)).toThrow(/declared too late/)
		})
	})
})
