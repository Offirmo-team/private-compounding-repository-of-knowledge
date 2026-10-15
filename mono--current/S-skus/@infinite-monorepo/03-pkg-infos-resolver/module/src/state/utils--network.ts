/////////////////////////////////////////////////
// Retrieve package.json files from public sources, resiliently:
// - light requests = a single version manifest, NOT the multi-MB "packument" (unless no other choice)
// - per-request timeout + retries + global concurrency cap
// - several sources: a transient failure (timeout, 429, 5xx, network) moves to the next one
// - a 404 is conclusive = "no such package"

export interface NetworkRetrievalOptions {
	version_specifier: SemVerⳇRange | undefined
	minimum_release_age‿minutes: number
}

// injectable for tests
export interface NetworkEnv {
	fetch: typeof globalThis.fetch
	now‿ms: number
	retry_delay‿ms: number
}

export interface VersionInfos {
	version_latest: SemVerⳇExact | undefined
	versions: Array<{
		version: SemVerⳇExact
		published_at‿ms: number | undefined
		is_deprecated: boolean
	}>
}

const REQUEST_TIMEOUT‿ms = 20_000
const REQUEST_TIMEOUTⵧpackument‿ms = 120_000 // can be several MB
const ATTEMPTS_PER_SOURCE = 3
const MAX_CONCURRENT_REQUESTS = 6

const REGISTRIES = [
	{ source: "npm", base_url: "https://registry.npmjs.org" },
	{ source: "yarnpkg", base_url: "https://registry.yarnpkg.com" }, // npm proxy, distinct endpoint
] as const

/////////////////////////////////////////////////

export async function ↆfetchꓽpackageᐧjsonⵧfrom_network(
	pkg_name: PkgFQName,
	options: Immutable<NetworkRetrievalOptions>,
	env: Immutable<NetworkEnv> = {
		fetch: (...args) => globalThis.fetch(...args),
		now‿ms: Date.now(),
		retry_delay‿ms: 1000,
	},
): Promise<PackageJson> {
	console.log(
		`"${pkg_name}@${options.version_specifier ?? "latest"}" retrieving from the network… (min release age = ${options.minimum_release_age‿minutes}min)`,
	)

	const needsꓽversion_selection = !!options.version_specifier || options.minimum_release_age‿minutes > 0
	if (!needsꓽversion_selection) return _ↆfetchꓽmanifest(pkg_name, "latest", env)

	const { version, manifest } = await _ↆselectꓽversion(pkg_name, options, env)
	return manifest ?? _ↆfetchꓽmanifest(pkg_name, version, env)
}

export function pickꓽversion(
	infos: Immutable<VersionInfos>,
	options: Immutable<NetworkRetrievalOptions>,
	now‿ms: number,
): SemVerⳇExact | undefined {
	const { version_specifier, minimum_release_age‿minutes } = options
	const published_before‿ms = now‿ms - minimum_release_age‿minutes * 60_000
	// no specifier = "latest" = never above the "latest" dist-tag
	const range = version_specifier ?? (infos.version_latest ? `<=${infos.version_latest}` : "*")

	const candidates = infos.versions
		.filter(({ version }) => !!semver.valid(version) && semver.satisfies(version, range))
		// no date = very old version, from before npm recorded them
		.filter(({ published_at‿ms }) => published_at‿ms === undefined || published_at‿ms <= published_before‿ms)
		// same as package-json: deprecated versions are skipped, except an explicitly targeted "latest"
		.filter(
			({ version, is_deprecated }) => !is_deprecated || (!version_specifier && version === infos.version_latest),
		)
		.map(({ version }) => version)

	return semver.maxSatisfying(candidates, range) ?? undefined
}

/////////////////////////////////////////////////

async function _ↆfetchꓽmanifest(
	pkg_name: PkgFQName,
	version_or_tag: SemVerⳇExact | "latest",
	env: Immutable<NetworkEnv>,
): Promise<PackageJson> {
	const manifest = await _ↆfetchꓽjsonⵧfirst_conclusive(
		pkg_name,
		[
			...REGISTRIES.map(({ source, base_url }) => ({
				source,
				url: `${base_url}/${_encodeꓽfor_registry(pkg_name)}/${version_or_tag}`,
			})),
			// CDNs serve the actual published package.json
			{ source: "unpkg", url: `https://unpkg.com/${pkg_name}@${version_or_tag}/package.json` },
			{ source: "jsDelivr", url: `https://cdn.jsdelivr.net/npm/${pkg_name}@${version_or_tag}/package.json` },
		],
		REQUEST_TIMEOUT‿ms,
		env,
	)
	if (manifest === null) throw _createꓽerror("PackageNotFoundError", `Package "${pkg_name}" could not be found`)

	return manifest as PackageJson
}

async function _ↆselectꓽversion(
	pkg_name: PkgFQName,
	options: Immutable<NetworkRetrievalOptions>,
	env: Immutable<NetworkEnv>,
): Promise<{ version: SemVerⳇExact; manifest?: PackageJson }> {
	// deps.dev = light (no manifests) but it's only an optimization:
	// on any miss (it may lag behind npm), the npm packument is authoritative
	const versionⵧdeps_dev = await _ↆfetchꓽversion_infosⵧdeps_dev(pkg_name, env).then(
		(infos) => (infos ? pickꓽversion(infos, options, env.now‿ms) : undefined),
		(err) => {
			console.warn(
				`"${pkg_name}": deps.dev unavailable (${_describeꓽerror(err)}), falling back to the full packument…`,
			)
			return undefined
		},
	)
	if (versionⵧdeps_dev) return { version: versionⵧdeps_dev }

	const packument = await _ↆfetchꓽjsonⵧfirst_conclusive(
		pkg_name,
		REGISTRIES.map(({ source, base_url }) => ({ source, url: `${base_url}/${_encodeꓽfor_registry(pkg_name)}` })),
		REQUEST_TIMEOUTⵧpackument‿ms,
		env,
	)
	if (packument === null) throw _createꓽerror("PackageNotFoundError", `Package "${pkg_name}" could not be found`)

	const version = pickꓽversion(_toꓽversion_infosⵧfrom_packument(packument), options, env.now‿ms)
	if (!version) {
		throw _createꓽerror(
			"VersionNotFoundError",
			`No version of "${pkg_name}" matches "${options.version_specifier ?? "latest"}" while being older than ${options.minimum_release_age‿minutes}min`,
		)
	}

	return { version, manifest: packument.versions[version] }
}

// null = conclusive "not found"
async function _ↆfetchꓽversion_infosⵧdeps_dev(
	pkg_name: PkgFQName,
	env: Immutable<NetworkEnv>,
): Promise<VersionInfos | null> {
	const raw = await _ↆfetchꓽjsonⵧwith_retries(
		`https://api.deps.dev/v3/systems/npm/packages/${encodeURIComponent(pkg_name)}`,
		REQUEST_TIMEOUT‿ms,
		env,
	)
	if (raw === null) return null

	return {
		version_latest: raw.versions.find((v: any) => v.isDefault)?.versionKey.version,
		versions: raw.versions.map((v: any) => ({
			version: v.versionKey.version,
			published_at‿ms: _parseꓽdate‿ms(v.publishedAt),
			is_deprecated: !!v.isDeprecated,
		})),
	}
}

function _toꓽversion_infosⵧfrom_packument(packument: any): VersionInfos {
	return {
		version_latest: packument["dist-tags"]?.latest,
		versions: Object.entries(packument.versions ?? {}).map(([version, manifest]: [string, any]) => ({
			version,
			published_at‿ms: _parseꓽdate‿ms(packument.time?.[version]),
			is_deprecated: !!manifest.deprecated,
		})),
	}
}

// null = 404 = conclusive, no need to ask other sources
async function _ↆfetchꓽjsonⵧfirst_conclusive(
	pkg_name: PkgFQName, // for logs
	candidates: ReadonlyArray<{ source: string; url: string }>,
	timeout‿ms: number,
	env: Immutable<NetworkEnv>,
): Promise<any | null> {
	const failures: Array<string> = []
	for (const [index, { source, url }] of candidates.entries()) {
		try {
			return await _ↆfetchꓽjsonⵧwith_retries(url, timeout‿ms, env)
		} catch (err) {
			failures.push(`- ${source}: ${_describeꓽerror(err)}`)
			const next = candidates[index + 1]
			if (next)
				console.warn(`"${pkg_name}": ${source} unavailable (${_describeꓽerror(err)}), trying ${next.source}…`)
		}
	}

	throw new Error(`All sources failed for "${pkg_name}":\n${failures.join("\n")}${_getꓽproxy_hint(process.env)}`)
}

// Node's fetch() ignores the proxy env vars unless opted-in https://nodejs.org/api/cli.html#node_use_env_proxy1
// = direct connections, which are dropped on proxied networks (connect timeouts)
function _getꓽproxy_hint(env: Immutable<Record<string, string | undefined>>): string {
	const hasꓽproxy = !!(env["HTTPS_PROXY"] || env["https_proxy"] || env["HTTP_PROXY"] || env["http_proxy"])
	if (!hasꓽproxy || env["NODE_USE_ENV_PROXY"] === "1") return ""

	return `\nHint: a proxy is configured in your env but Node's fetch() ignores it, try again with NODE_USE_ENV_PROXY=1`
}

async function _ↆfetchꓽjsonⵧwith_retries(
	url: string,
	timeout‿ms: number,
	env: Immutable<NetworkEnv>,
	attempt = 1,
): Promise<any | null> {
	try {
		return await _ↆfetchꓽjson(url, timeout‿ms, env)
	} catch (err) {
		if (!_isꓽtransient(err) || attempt >= ATTEMPTS_PER_SOURCE) throw err

		await elapsed_time_ms(env.retry_delay‿ms * attempt)
		return _ↆfetchꓽjsonⵧwith_retries(url, timeout‿ms, env, attempt + 1)
	}
}

async function _ↆfetchꓽjson(url: string, timeout‿ms: number, env: Immutable<NetworkEnv>): Promise<any | null> {
	return _limitꓽconcurrency(async () => {
		const response = await env.fetch(url, {
			headers: { accept: "application/json" },
			signal: AbortSignal.timeout(timeout‿ms), // covers the body download as well
		})
		if (!response.ok) {
			await response.body?.cancel() // free the connection
			if (response.status === 404) return null
			throw Object.assign(new Error(`HTTP ${response.status} for ${url}`), {
				name: "HTTPError",
				status: response.status,
			})
		}

		return await response.json()
	})
}

function _isꓽtransient(err: unknown): boolean {
	const { name, status } = (err ?? {}) as { name?: string; status?: number }
	if (name === "TimeoutError" || name === "AbortError") return true
	if (name === "TypeError") return true // fetch() network failure
	return status === 429 || (status !== undefined && status >= 500)
}

const _limitꓽconcurrency = _createꓽconcurrency_limiter(MAX_CONCURRENT_REQUESTS)
function _createꓽconcurrency_limiter(max: number) {
	let active_count = 0
	const waiting: Array<() => void> = []

	return async function limitꓽconcurrency<T>(task: () => Promise<T>): Promise<T> {
		if (active_count < max) active_count++
		else await new Promise<void>((resolve) => waiting.push(resolve)) // a finishing task hands us its slot

		try {
			return await task()
		} finally {
			const next = waiting.shift()
			if (next) next()
			else active_count--
		}
	}
}

// fetch() hides the actual reason in .cause, ex. "fetch failed" + UND_ERR_CONNECT_TIMEOUT
function _describeꓽerror(err: unknown): string {
	const { message, cause } = (err ?? {}) as { message?: string; cause?: { code?: string } }
	return cause?.code ? `${message}: ${cause.code}` : String(message)
}

// "@types/node" -> "@types%2Fnode"
function _encodeꓽfor_registry(pkg_name: PkgFQName): string {
	return encodeURIComponent(pkg_name).replace(/^%40/, "@")
}

function _parseꓽdate‿ms(date: string | undefined): number | undefined {
	if (!date) return undefined
	const result = Date.parse(date)
	return Number.isNaN(result) ? undefined : result
}

// .name = what callers check, ex. "PackageNotFoundError"
function _createꓽerror(name: string, message: string): Error {
	return Object.assign(new Error(message), { name })
}

/////////////////////////////////////////////////

import * as semver from "semver"

import { assert } from "@monorepo-private/assert"
import type { Immutable, SemVerⳇExact, SemVerⳇRange } from "@monorepo-private/ts--types"
import { elapsed_time_ms } from "@monorepo-private/utils--async"

import type { PackageJson, PkgFQName } from "./types.ts"
