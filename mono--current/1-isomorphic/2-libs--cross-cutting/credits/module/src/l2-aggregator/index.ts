/* Code allowing to register an asset usage,
 * so that we can credit the creators
 * and showcase them by displaying an attribution in-app for certain major assets.
 */

import { assert_from, assert } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type { Asset, Url‿str, PathⳇAny } from "../l1-types/index.ts"

/////////////////////////////////////////////////

interface AssetStore {
	assetsⵧall: Set<Immutable<Asset>>
	assetsⵧrecents: Array<Immutable<Asset>>
}

const STORE: AssetStore = {
	assetsⵧall: new Set<Immutable<Asset>>(),
	assetsⵧrecents: [],
}

/////////////////////////////////////////////////

// "fire and forget"
// called by the asset file itself on load,
// whether it’s used or not
function registerꓽasset_usageⵧload(asset: Immutable<Asset>): void {
	// TODO unique id?
	// TODO need duplicate detection?
	if (STORE.assetsⵧall.has(asset)) {
		console.warn(`🖼️ "${asset.type}" asset: ${asset.description} multiple load??`)
	}

	STORE.assetsⵧall.add(asset)
}

// "fire and forget"
// called by the user of the asset
// so that we can show "currently/recently" used assets
function registerꓽasset_usageⵧstart(asset: Immutable<Asset>): void {
	if (STORE.assetsⵧrecents.includes(asset)) return

	console.log(
		`🖼️ about to feature a ${asset.type} asset from "${asset.author?.name || "unknown"}": "${asset.description}"`,
	)

	STORE.assetsⵧall.add(asset)
	STORE.assetsⵧrecents.unshift(asset)
	STORE.assetsⵧrecents = STORE.assetsⵧrecents.slice(0, 12)
}

// "fire and forget"
// call is optional
function registerꓽasset_usageⵧend(asset: Immutable<Asset>): void {
	// TODO useful?
}

// return all currently registered assets
function getꓽassetsⵧall(): Immutable<Set<Immutable<Asset>>> {
	return STORE.assetsⵧall
}

// return the most recently used/loaded assets
function getꓽassetsⵧrecents(n = 12): Immutable<Array<Immutable<Asset>>> {
	return STORE.assetsⵧrecents
}

/////////////////////////////////////////////////
// helpers

function getꓽurl(asset: Immutable<Asset>): Url‿str {
	registerꓽasset_usageⵧstart(asset)
	return asset.url
}
function _getꓽurl_tobind(this: Immutable<Asset>): Url‿str {
	return getꓽurl(this)
}

function getꓽpath(asset: Immutable<Asset>): PathⳇAny {
	const url = getꓽurl(asset)
	assert(url.startsWith("file://"), "Credits: asset Url is expected to start with file://!")
	const url_obj = new URL(url)
	return url_obj.pathname
}
function _getꓽpath_tobind(this: Immutable<Asset>): Url‿str {
	return getꓽpath(this)
}

/////////////////////////////////////////////////

export * from "../l1-types/index.ts"
export {
	registerꓽasset_usageⵧload,
	registerꓽasset_usageⵧstart,
	registerꓽasset_usageⵧend,
	getꓽassetsⵧall,
	getꓽassetsⵧrecents,
	getꓽurl,
	_getꓽurl_tobind,
	getꓽpath,
	_getꓽpath_tobind,
}
