import { combineꓽnormalizers } from "../../l2-core/normalize.ts"
import { normalize_unicode, remove_all_spaces } from "../1-base/index.ts"
import { normalizeꓽemailⵧreasonable, hasꓽemail_structure } from "../2-email/index.ts"

/////////////////////////////////////////////////
// https://en.wikipedia.org/wiki/URL

// TODO use current origin?
const FAKE_ORIGIN = "https://placeholder.fake"

function _normalizeꓽschemeꘌhttpₓ(url: string): string {
	try {
		// TODO one day URL.canParse
		new URL(url, FAKE_ORIGIN)
	} catch (e) {
		throw new Error(`Invalid URL!`)
	}

	let [raw_scheme, ...rest] = url.split(":")
	let scheme = (raw_scheme || "").toLowerCase()

	if (scheme === "http") {
		// upgrade to https
		// YES I know it can break the link
		// but this upgrade is good more often than not
		scheme = "https"
	}

	if (scheme !== "https") {
		throw new Error(`Not a http(s) scheme "${scheme}"!`)
	}

	return [scheme, ...rest].join(":")
}

function _normalize_per_scheme(url: string): string {
	// classic case of passing a raw email without the "mailto:" scheme
	if (!url.includes(":")) {
		if (hasꓽemail_structure(url)) url = `mailto:${url}`
	}

	let [raw_scheme, ...rest] = url.includes(":") ? url.split(":") : ["", url]
	let scheme = raw_scheme!.toLowerCase()

	switch (scheme) {
		case "mailto":
			rest = [normalizeꓽemailⵧreasonable(url.slice("mailto:".length))]
			break
		case "http":
		/* falls through */
		case "https": {
			url = _normalizeꓽschemeꘌhttpₓ([scheme, ...rest].join(":"))

			// TODO remove trackers
			// TODO add trailing slash
			// TODO normalize URI encoding
			// TODO check forbidden domains https://www.rfc-editor.org/rfc/rfc2606.html#section-2

			;[scheme, ...rest] = url.split(":") as [string, string]
			break
		}

		default:
			if (!scheme) {
				// scheme-less URL, allowed, don't add unnecessary ':'
				return [...rest].join(":")
			} else {
				// TODO more schemes
				console.warn(`normalizeꓽurl: Unknown scheme "${scheme}"!`)
			}
			break
	}

	return [scheme, ...rest].join(":")
}

function _normalizeꓽurl__structure(possible_url: string | URL): string {
	const url‿obj = possible_url instanceof URL ? possible_url : new URL(possible_url, FAKE_ORIGIN)

	url‿obj.searchParams.sort()

	return (
		(url‿obj.origin === FAKE_ORIGIN
			? ""
			: url‿obj.origin === "null"
				? url‿obj.protocol // no origin, ex. email -> fallback on protocol mailto:
				: url‿obj.origin) +
		url‿obj.pathname +
		url‿obj.search +
		url‿obj.hash
	)
}

const normalizeꓽurl = combineꓽnormalizers(
	normalize_unicode,
	remove_all_spaces, // yes in theory we could encode them, but a space is more likely a typo, ex. wrong input type for email "Offirmo. Net@gmail. Com"
	_normalize_per_scheme,
	_normalizeꓽurl__structure,
)

const normalizeꓽurlⵧhttpₓ = combineꓽnormalizers(normalizeꓽurl, _normalizeꓽschemeꘌhttpₓ)

/////////////////////////////////////////////////

export { FAKE_ORIGIN, normalizeꓽurl, normalizeꓽurlⵧhttpₓ }
