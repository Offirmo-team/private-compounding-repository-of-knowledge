import { describe, it, expect } from "vitest"

import { ↆfetchꓽpackageᐧjsonⵧfrom_network, pickꓽversion, type NetworkEnv, type VersionInfos } from "./utils--network.ts"

const DAY‿ms = 24 * 3600 * 1000
const NOW‿ms = Date.parse("2026-10-14T12:00:00Z")
const MIN_AGE__1_DAY = 24 * 60

describe("@infinite-monorepo/pkg-infos-resolver — network", () => {
	describe("pickꓽversion()", () => {
		const infos: VersionInfos = {
			version_latest: "2.1.0",
			versions: [
				{ version: "1.0.0", published_at‿ms: undefined, is_deprecated: false },
				{ version: "1.5.0", published_at‿ms: NOW‿ms - 30 * DAY‿ms, is_deprecated: true },
				{ version: "2.0.0", published_at‿ms: NOW‿ms - 10 * DAY‿ms, is_deprecated: false },
				{ version: "2.1.0", published_at‿ms: NOW‿ms - 1000, is_deprecated: false },
				{ version: "3.0.0-beta.1", published_at‿ms: NOW‿ms - 10 * DAY‿ms, is_deprecated: false },
			],
		}

		it("picks latest when old enough", () => {
			expect(pickꓽversion(infos, { version_specifier: undefined, minimum_release_age‿minutes: 0 }, NOW‿ms)).toBe(
				"2.1.0",
			)
		})

		it("falls back to an older version when latest is too young", () => {
			expect(
				pickꓽversion(infos, { version_specifier: undefined, minimum_release_age‿minutes: MIN_AGE__1_DAY }, NOW‿ms),
			).toBe("2.0.0")
		})

		it("honors the specifier and skips deprecated versions", () => {
			expect(pickꓽversion(infos, { version_specifier: "^1", minimum_release_age‿minutes: 0 }, NOW‿ms)).toBe("1.0.0")
		})

		it("keeps an explicitly targeted deprecated latest (like package-json)", () => {
			const infosⵧdeprecated_latest: VersionInfos = {
				version_latest: "1.5.0",
				versions: infos.versions.slice(0, 2),
			}
			expect(
				pickꓽversion(
					infosⵧdeprecated_latest,
					{ version_specifier: undefined, minimum_release_age‿minutes: 0 },
					NOW‿ms,
				),
			).toBe("1.5.0")
		})

		it("returns undefined when nothing qualifies", () => {
			expect(
				pickꓽversion(infos, { version_specifier: "^2.1", minimum_release_age‿minutes: MIN_AGE__1_DAY }, NOW‿ms),
			).toBeUndefined()
		})
	})

	describe("ↆfetchꓽpackageᐧjsonⵧfrom_network()", () => {
		it("only needs a single light request for latest without min age", async () => {
			const { env, calls } = createꓽfake_env({
				"https://registry.npmjs.org/foo/latest": { name: "foo", version: "1.2.3" },
			})
			const result = await ↆfetchꓽpackageᐧjsonⵧfrom_network(
				"foo",
				{ version_specifier: undefined, minimum_release_age‿minutes: 0 },
				env,
			)
			expect(result.version).toBe("1.2.3")
			expect(calls).toEqual(["https://registry.npmjs.org/foo/latest"])
		})

		it("retries on timeout then moves to the next source", async () => {
			const { env, calls } = createꓽfake_env({
				"https://registry.npmjs.org/@types%2Ffoo/latest": "timeout",
				"https://registry.yarnpkg.com/@types%2Ffoo/latest": { name: "@types/foo", version: "1.0.0" },
			})
			const result = await ↆfetchꓽpackageᐧjsonⵧfrom_network(
				"@types/foo",
				{ version_specifier: undefined, minimum_release_age‿minutes: 0 },
				env,
			)
			expect(result.version).toBe("1.0.0")
			expect(calls).toEqual([
				"https://registry.npmjs.org/@types%2Ffoo/latest",
				"https://registry.npmjs.org/@types%2Ffoo/latest",
				"https://registry.npmjs.org/@types%2Ffoo/latest",
				"https://registry.yarnpkg.com/@types%2Ffoo/latest",
			])
		})

		it("treats a 404 as a conclusive 'no such package'", async () => {
			const { env, calls } = createꓽfake_env({
				"https://registry.npmjs.org/nope/latest": 404,
			})
			await expect(
				ↆfetchꓽpackageᐧjsonⵧfrom_network(
					"nope",
					{ version_specifier: undefined, minimum_release_age‿minutes: 0 },
					env,
				),
			).rejects.toMatchObject({ name: "PackageNotFoundError" })
			expect(calls).toHaveLength(1)
		})

		it("selects the version through deps.dev then fetches its manifest", async () => {
			const { env } = createꓽfake_env({
				"https://api.deps.dev/v3/systems/npm/packages/foo": {
					versions: [
						{ versionKey: { version: "1.0.0" }, publishedAt: "2026-01-01T00:00:00Z", isDefault: false },
						{ versionKey: { version: "1.1.0" }, publishedAt: "2026-10-14T11:00:00Z", isDefault: true },
					],
				},
				"https://registry.npmjs.org/foo/1.0.0": { name: "foo", version: "1.0.0" },
			})
			const result = await ↆfetchꓽpackageᐧjsonⵧfrom_network(
				"foo",
				{ version_specifier: undefined, minimum_release_age‿minutes: MIN_AGE__1_DAY },
				env,
			)
			expect(result.version).toBe("1.0.0")
		})

		it("falls back to the full packument when deps.dev is down", async () => {
			const { env } = createꓽfake_env({
				"https://api.deps.dev/v3/systems/npm/packages/foo": 503,
				"https://registry.npmjs.org/foo": {
					"dist-tags": { latest: "6.1.0" },
					versions: { "6.0.0": { name: "foo", version: "6.0.0" }, "6.1.0": { name: "foo", version: "6.1.0" } },
					time: { "6.0.0": "2026-01-01T00:00:00Z", "6.1.0": "2026-10-14T11:00:00Z" },
				},
			})
			const result = await ↆfetchꓽpackageᐧjsonⵧfrom_network(
				"foo",
				{ version_specifier: "^6", minimum_release_age‿minutes: MIN_AGE__1_DAY },
				env,
			)
			expect(result.version).toBe("6.0.0")
		})

		it("fails clearly when every source is unavailable", async () => {
			const { env } = createꓽfake_env({})
			await expect(
				ↆfetchꓽpackageᐧjsonⵧfrom_network(
					"foo",
					{ version_specifier: undefined, minimum_release_age‿minutes: 0 },
					env,
				),
			).rejects.toThrow(/All sources failed/)
		})
	})
})

/////////////////////////////////////////////////

// unknown URL = network failure
function createꓽfake_env(routes: Record<string, object | number | "timeout">): { env: NetworkEnv; calls: string[] } {
	const calls: string[] = []
	const fetch = (async (url: string) => {
		calls.push(url)
		const route = routes[url]
		if (route === undefined) throw new TypeError("fetch failed")
		if (route === "timeout") throw new DOMException("The operation was aborted due to timeout", "TimeoutError")
		if (typeof route === "number") return new Response("{}", { status: route })
		return new Response(JSON.stringify(route), { status: 200 })
	}) as typeof globalThis.fetch

	return { env: { fetch, now‿ms: NOW‿ms, retry_delay‿ms: 0 }, calls }
}
