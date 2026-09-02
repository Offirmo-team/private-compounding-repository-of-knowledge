// Relpath should NOT feature ./ as it's up to the caller to decide if they want it or not
// always use safe defaults

/////////////////////////////////////////////////
// re-export some
export {
	getꓽlang,
	getꓽcharset,
	getꓽauthor__name,
	getꓽauthor__contact,
	getꓽauthor__intro,
	getꓽcontactⵧhuman,
	getꓽcontactⵧsecurity,
	getꓽcontactⵧsupport,
} from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////
// meta

export function isꓽdebug(spec: Immutable<WebPropertySpec>): boolean {
	return spec.isꓽdebug ?? false
}

export function getꓽENV(spec: Immutable<WebPropertySpec>): string {
	return String((spec.env ?? process.env["NODE_ENV"]) || "development").toLowerCase()
}

export function isꓽprod(spec: Immutable<WebPropertySpec>): boolean {
	return getꓽENV(spec) === "production" || getꓽENV(spec) === "prod"
}

export function isꓽpublic(spec: Immutable<WebPropertySpec>): boolean {
	return spec.isꓽpublic ?? isꓽprod(spec)
}

export function shouldꓽgenerateꓽjscode(spec: Immutable<WebPropertySpec>): boolean {
	return spec.generatesꓽjsⵧscaffold ? true : false
}

// Note: should not be used unless host-specific files
export function getꓽdirⵧoutput_root(spec: Immutable<WebPropertySpec>): PathⳇRelative {
	return `${spec.host ?? ""}`
}

export function getꓽdirⵧfiles_to_serve(spec: Immutable<WebPropertySpec>): string {
	if (spec.host === "github-pages") return `${getꓽdirⵧoutput_root(spec)}/docs`

	if (!!getꓽdirⵧoutput_root(spec)) return `${getꓽdirⵧoutput_root(spec)}/serve-me`

	return `serve-me`
}

/////////////////////////////////////////////////
// features

export function wantsꓽinstall(spec: Immutable<WebPropertySpec>): boolean {
	if (typeof spec.wantsꓽinstall === "string") return true

	if (spec.wantsꓽinstall === false) return false

	// not provided

	return false
}

/* Does this site have its own nav? (ex. app, game)
 * or does it need the browser nav = back button?
 */
export function hasꓽown_navigation(spec: Immutable<WebPropertySpec>): boolean {
	if (typeof spec.hasꓽown_navigation === "boolean") return spec.hasꓽown_navigation

	return false
}

export function isꓽuser_scalable(spec: Immutable<WebPropertySpec>): boolean {
	// by default, every site should be user-scalable
	// it's a basic accessibility feature https://moritzgiessmann.de/accessibility-cheatsheet/
	return !hasꓽown_navigation(spec)
}

export function needsꓽwebmanifest(spec: Immutable<WebPropertySpec>): boolean {
	return wantsꓽinstall(spec)
}

export function supportsꓽscreensⵧwith_shape(spec: Immutable<WebPropertySpec>): boolean {
	return spec.supportsꓽscreensⵧwith_shape ?? false
}

export function canꓽuse_window_controls_overlay(spec: Immutable<WebPropertySpec>): boolean {
	return spec.canꓽuse_window_controls_overlay ?? false
}

export function usesꓽpull_to_refresh(spec: Immutable<WebPropertySpec>): boolean {
	return spec.usesꓽpull_to_refresh ?? true
}

export function prefersꓽorientation(spec: Immutable<WebPropertySpec>): boolean {
	// TODO
	return false
}

export function getꓽfeatures(spec: Immutable<WebPropertySpec>): FeatureSnippets[] {
	const features = new Set<FeatureSnippets>(spec.features ?? [])

	features.add("cssⳇbox-layout--natural")

	if (!features.has("cssⳇfoundation--offirmo")) features.add("cssⳇframework--offirmo")

	return Array.from(features).filter((f) => {
		assert(Enum.isType(FeatureSnippets, f), `Unknown feature "${f}"!`)
		return true
	})
}

/////////////////////////////////////////////////
// content
export function getꓽtitleⵧpage(spec: Immutable<WebPropertySpec>): string {
	return _getꓽtitle(spec)
}
export function getꓽtitleⵧsocial(spec: Immutable<WebPropertySpec>): string {
	// TODO
	return _getꓽtitle(spec)
	/*return !!spec.titleⵧsocial
		? normalize_unicode(spec.titleⵧsocial).trim()
		: _getꓽtitle(spec) */
}
export function getꓽtitleⵧapp(spec: Immutable<WebPropertySpec>): string {
	return !!spec.titleⵧapp ? normalize_unicode(spec.titleⵧapp).trim() : _getꓽtitle(spec)
}
export function getꓽtitleⵧappⵧshort(spec: Immutable<WebPropertySpec>): string {
	// TODO
	return getꓽtitleⵧapp(spec)
}
export function getꓽtitleⵧlib(spec: Immutable<WebPropertySpec>): string {
	const base = getꓽtitleⵧappⵧshort({
		...spec,
		lang: "en",
	})

	return coerce_toꓽsafe_basenameⵧstrictest(base)
}

function _getꓽtitle(spec: Immutable<WebPropertySpec>): string {
	const candidate_own = normalizeꓽtextⵧsentence(spec.title ?? "")
	if (candidate_own) return candidate_own

	if (spec.content) {
		const candidate_content = Contentⳇwebᐧgetꓽtitle(spec.content)
		if (candidate_content) return candidate_content
	}

	//throw new Error(`Sorry, we need a title, I can't infer one!`)
	return "Hello, World!"
}

export function getꓽdescriptionⵧpage(spec: Immutable<WebPropertySpec>): string {
	return _getꓽdescription(spec)
}

/////////////////////////////////////////////////
// polish

export function getꓽcolorⵧforeground(spec: Immutable<WebPropertySpec>): CssⳇColor‿str {
	const candidate = spec.colorⵧforeground ?? "black"
	assert(chroma.valid(candidate), `Invalid fg color "${candidate}"!`)
	return chroma(candidate).name()
}

export function getꓽcolorⵧbackground(spec: Immutable<WebPropertySpec>): CssⳇColor‿str {
	const candidate = spec.colorⵧbackground ?? "white"
	assert(chroma.valid(candidate), `Invalid bg color "${candidate}"!`)
	return chroma(candidate).name()
}

export function getꓽcolorⵧtheme(spec: Immutable<WebPropertySpec>): CssⳇColor‿str {
	const candidate = spec.colorⵧtheme ?? getꓽcolorⵧbackground(spec)
	assert(chroma.valid(candidate), `Invalid theme color "${candidate}"!`)
	return chroma(candidate).name()
}

/////////////////////////////////////////////////

function _getꓽbasenameⵧwithout_extension(spec: Immutable<WebPropertySpec>): Basename {
	if (!spec.basename) return "index"

	assert(path.extname(spec.basename) === "")
	const safe_version = coerce_toꓽsafe_basenameⵧstrictest(spec.basename)
	assert(spec.basename === safe_version, `basename "${spec.basename}" is unsafe, it should be "${safe_version}"!`)
	return safe_version
}

export function getꓽbasenameⵧindexᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `${_getꓽbasenameⵧwithout_extension(spec)}.html`
}

export function getꓽbasenameⵧcontactᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `contact.html`
}
export function getꓽbasenameⵧerrorᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `error.html`
}
export function getꓽbasenameⵧaboutᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `about.html`
}
export function getꓽbasenameⵧterms_and_conditionsᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `terms-and-conditions.html`
}
export function getꓽbasenameⵧprivacy_policyᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `privacy-policy.html`
}
export function getꓽbasenameⵧsupportᐧhtml(spec: Immutable<WebPropertySpec>): Basename {
	return `support.html`
}

export function getꓽbasenameⵧwebmanifest(spec: Immutable<WebPropertySpec>): Basename {
	// the recommended extension is .webmanifest https://web.dev/learn/pwa/web-app-manifest/
	return `${_getꓽbasenameⵧwithout_extension(spec)}.webmanifest`
}

export function getꓽiconⵧemoji(spec: Immutable<WebPropertySpec>): Emoji {
	return spec.icon?.emoji ?? "🌍"
}

// get a REAL svg if any is provided, undef else
export function getꓽiconⵧsvg(spec: Immutable<WebPropertySpec>): Immutable<SVG> | undefined {
	const svg_value = spec.icon?.svg

	if (!svg_value) return undefined

	if (typeof svg_value === "string") {
		// it's a path, we need to load
		console.warn("TODO load SVG from path", svg_value)
		return undefined
	}

	return spec.icon.svg as any
}

export function getꓽiconsⵧpng(spec: Immutable<WebPropertySpec>): Map<number, PathⳇAny> {
	const map = new Map<number, PathⳇAny>()
	const pngs_value = spec.icon?.pngs

	if (pngs_value) {
		const sizes = Object.keys(pngs_value).map(Number).sort()
		sizes.forEach((size) => {
			map.set(size, pngs_value[size]!)
		})
	}

	return map
}

// TODO move to own file?
export function getꓽicon__sizes(spec: Immutable<WebPropertySpec>): Uint32Array {
	const sizes = new Set<number>()

	// Absolutely required: favicon
	// The optimal size for favicons is 16x16 pixels.
	// That’s how they appear in browser tabs, address bars, and bookmark lists.
	// https://blog.hubspot.com/website/what-is-a-favicon#size
	sizes.add(16)

	const available_pngs = getꓽiconsⵧpng(spec)
	let max_known_size = 0
	// if we have pngs, add them...
	for (const size of available_pngs.keys()) {
		sizes.add(size)
		max_known_size = Math.max(max_known_size, size)
	}

	// only PWA need big ones
	if (!wantsꓽinstall(spec)) {
		// generate a slightly bigger one in case the website ends up pinned
		// even if we don't want to install, we still want to look good
		sizes.add(192)
	} else {
		// OK we're a PWA
		// we need nice big icons,
		// however, hosts will usually naturally pick the closest size, so no need to overdo it

		// https://web.dev/learn/pwa/web-app-manifest/#icons
		// "If you need to pick only one icon size, it should be 512 by 512 pixels" (TODO date)
		if (max_known_size === 0) {
			// no PNG at all!
			// force at least a big one, to be generated from the SVG or emoji
			sizes.add(512)
			max_known_size = Math.max(max_known_size, 512)
		}

		// However, providing more sizes is recommended…
		if (getꓽiconⵧsvg(spec)) {
			// we have a SVG so we can generate any size!

			// iOs
			// https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes
			// "You need to provide a large version of your app icon, measuring 1024x1024"
			sizes.add(1024)
			// You can let the system automatically scale down your large app icon to produce all other sizes,
			// or — if you want to customize the appearance of the icon at specific sizes — you can supply multiple versions.
			// (TODO 1D customize per size, for now it's always the same icon)

			// macOs
			// https://developer.apple.com/design/human-interface-guidelines/app-icons#macOS-app-icon-sizes
			// create a 1024x1024 px version of your macOS app icon
			sizes.add(1024)
			// In addition, you also need to supply the icon in the following sizes...
			// (TODO 1D customize per size)

			// TODO add other stores / oses specifications
		}
	}

	return Uint32Array.from(sizes.values()).sort().reverse()
}

function getꓽicon__basename(spec: Immutable<WebPropertySpec>, size: number | null): Basename {
	if (size === null) return `icon.svg`

	if (size === 16) return `favicon.ico`

	return `icon-${size}.png`
}

export function getꓽicon__path(spec: Immutable<WebPropertySpec>, size: number | null): PathⳇRelative {
	const basename = getꓽicon__basename(spec, size)
	const path = [basename]
	if (basename !== "favicon.ico") path.unshift("icons")
	return path.join("/")
}

// keywords: todo dedupe, add categories, lowercase, etc.

/////////////////////////////////////////////////

import * as path from "node:path"

import { Enum } from "typescript-string-enums"

import { assert_from, assert } from "@monorepo-private/assert"
const chroma = ((await import("chroma-js")) as any).default as chroma.ChromaStatic // has ESM issues 2024/08

import { FeatureSnippets } from "@web-property-outfitter/generator--html"
import { type SVG } from "@web-property-outfitter/generator--svg"

import {
	normalize_unicode,
	coerce_toꓽsafe_basenameⵧstrictest,
	normalizeꓽtextⵧsentence,
} from "@monorepo-private/normalize-string"
import type { PathⳇAny, Basename, Immutable, PathⳇRelative } from "@monorepo-private/ts--types"
import {
	type Emoji,
	getꓽtitle as Contentⳇwebᐧgetꓽtitle,
	getꓽdescription as _getꓽdescription,
} from "@monorepo-private/ts--types--hypermedia"
import type { CssⳇColor‿str } from "@monorepo-private/ts--types--hypermedia"

import type { WebPropertySpec } from "../types.ts"
