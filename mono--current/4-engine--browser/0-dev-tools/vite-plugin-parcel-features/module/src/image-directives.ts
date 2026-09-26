/* Pure part of the image-directives feature: parsing + naming, no fs, no sharp.
 * Kept dependency-free so it stays unit-testable without the native image codec.
 */

/////////////////////////////////////////////////

// Parcel's image transform query, ex. "original.png?as=webp&width=1920"
// https://parceljs.org/recipes/image/
// We accept Parcel's names (authoritative: the sources must keep working under `parcel serve`)
// plus the shorter aliases as a convenience.
export interface ImageDirectives {
	format: ImageFormat
	width: number | undefined
	height: number | undefined
	quality: number | undefined
}

export interface ImageReference {
	// byte range of the specifier's CONTENT (quotes excluded) within the module's code
	start‿index: number
	end‿index: number
	pathⳇrelative: string
	directives: ImageDirectives
}

export type ImageFormat = "avif" | "gif" | "jpeg" | "png" | "tiff" | "webp"

/////////////////////////////////////////////////

// Every `new URL("…", import.meta.url)` in `code` whose specifier carries actionable image directives.
// References without directives are skipped: Vite's own asset pipeline already handles those correctly.
export function parseꓽimage_references(code: string): ImageReference[] {
	return [...code.matchAll(REGEXⵧnew_url__all)].flatMap((match) => {
		const [start‿index, end‿index] = match.indices![GROUPⵧspecifier]!
		const [pathⳇrelative, searchⵧraw] = _splitꓽspecifier(match[GROUPⵧspecifier]!)

		const extension = getꓽextension(pathⳇrelative)
		if (!extension) return []

		const directives = parseꓽdirectives(searchⵧraw, extension)
		if (!directives) return []

		return [{ start‿index, end‿index, pathⳇrelative, directives }]
	})
}

// `undefined` when there is nothing to do, ex. a plain "./foo.png" or a query we don't own like "?url"
export function parseꓽdirectives(searchⵧraw: string, formatⵧsource: ImageFormat): ImageDirectives | undefined {
	const params = new URLSearchParams(searchⵧraw)

	const formatⵧrequested = params.get("as") ?? params.get("format") ?? undefined
	const format = formatⵧrequested === undefined ? formatⵧsource : getꓽformat(formatⵧrequested)

	const width = _getꓽpositive_integer(params, "width", "w")
	const height = _getꓽpositive_integer(params, "height", "h")
	const quality = _getꓽpositive_integer(params, "quality", "q")

	const isꓽactionable = formatⵧrequested !== undefined || !!width || !!height || !!quality

	return isꓽactionable ? { format, width, height, quality } : undefined
}

// Stable + human-readable, ex. ("original.png", {webp, w:1920}) => "original@w1920.webp"
// Directives are encoded in a fixed order so the name is a pure function of the request.
export function getꓽderived__name(nameⵧsource: string, directives: ImageDirectives): string {
	const { format, width, height, quality } = directives

	const stem = nameⳇwithout_extension(nameⵧsource)
	const suffix = [
		width === undefined ? "" : `w${width}`,
		height === undefined ? "" : `h${height}`,
		quality === undefined ? "" : `q${quality}`,
	].join("")

	return suffix ? `${stem}@${suffix}.${format}` : `${stem}.${format}`
}

export function getꓽformat(raw: string): ImageFormat {
	const ǃ = assert_from({ getꓽformat })

	const format = FORMATSⵧbyᐧalias[raw.toLowerCase()]
	ǃ.forⵧvalue({ raw }).assert(!!format, `should be a supported image format`)
	assert(!!format)

	return format
}

// `undefined` when the path has no extension we recognize as a transformable image
export function getꓽextension(pathⵧany: string): ImageFormat | undefined {
	const raw = REGEXⵧextension.exec(pathⵧany)?.[1]

	return raw ? FORMATSⵧbyᐧalias[raw.toLowerCase()] : undefined
}

export function nameⳇwithout_extension(pathⵧany: string): string {
	return pathⵧany.replace(REGEXⵧextension, "")
}

/////////////////////////////////////////////////

function _splitꓽspecifier(specifier: string): [pathⳇrelative: string, searchⵧraw: string] {
	const index = specifier.indexOf("?")

	return index === -1 ? [specifier, ""] : [specifier.slice(0, index), specifier.slice(index + 1)]
}

// Tolerates but ignores garbage (ex. "?width=abc"): a bundler shouldn't hard-fail on a malformed hint.
function _getꓽpositive_integer(params: URLSearchParams, ...names: string[]): number | undefined {
	const raw = names.map((name) => params.get(name)).find((value) => !!value)
	if (!raw) return undefined

	const value = Number.parseInt(raw, 10)

	return Number.isSafeInteger(value) && value > 0 ? value : undefined
}

/////////////////////////////////////////////////

const FORMATSⵧbyᐧalias: Readonly<Record<string, ImageFormat>> = {
	avif: "avif",
	gif: "gif",
	jpeg: "jpeg",
	jpg: "jpeg",
	png: "png",
	tif: "tiff",
	tiff: "tiff",
	webp: "webp",
}

// Group 1 = the quote char, group 2 = the specifier's content (may contain neither quote kind).
// `d` for group indices, `g` to walk every occurrence.
// Single/double-quoted literals only: a template literal is dynamic, so there'd be nothing to resolve at build time.
const REGEXⵧnew_url__all = /\bnew\s+URL\s*\(\s*(["'])([^"'\n]*)\1\s*,\s*import\s*\.\s*meta\s*\.\s*url\s*\)/dgu

// Same shape WITHOUT the `g`/`d` flags, for use as the plugin's cheap prefilter (a stateful regex would misbehave there).
export const REGEXⵧnew_url = new RegExp(REGEXⵧnew_url__all.source, "u")

const REGEXⵧextension = /\.([^./\\]+)$/u

const GROUPⵧspecifier = 2

/////////////////////////////////////////////////

import { assert, assert_from } from "@monorepo-private/assert"
