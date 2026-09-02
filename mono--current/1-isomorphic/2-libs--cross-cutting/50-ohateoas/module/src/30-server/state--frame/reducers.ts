import { assert_from, assert } from "@monorepo-private/assert"
import * as RichText from "@monorepo-private/rich-text-format"
import type { Immutable, Url‿str } from "@monorepo-private/ts--types"

import {
	OHALinkRelation,
	type OHAHyperLink‿x,
	type OHAHyperMedia,
	getꓽuriⵧnormalized‿str,
} from "../../01-types/index.ts"
import { getꓽlinks } from "../../10-representation/index.ts"
import { ROOT_URI } from "../index.ts"

import { getꓽurlⵧself } from "./selectors.ts"
import type { State } from "./types.js"

/////////////////////////////////////////////////
const LIB = "OHAFrameState"
const DEBUG = false

function create(starting_url: Url‿str = ROOT_URI): Immutable<State> {
	//DEBUG && console.log(`↘ ${LIB}: create()`, { starting_url })

	return {
		//urlⵧhome: ROOT_URI,

		urlⵧload: starting_url,
		reload_counter: 0,

		$representation: undefined, // so far
		//urlⵧself: undefined, // so far

		status_msg: getꓽstatus_msgꘌloading(starting_url),
	}
}

function onꓽloaded(state: Immutable<State>, $representation: Immutable<OHAHyperMedia | Error>): Immutable<State> {
	DEBUG &&
		console.log(`↘ ${LIB}: onꓽloaded()`, {
			state: structuredClone(state),
			$representation,
		})

	if (state.status_msg !== "") {
		state = {
			...state,
			status_msg: "",
		}
	}

	if ($representation instanceof Error) {
		const error = $representation

		if (RichText.isꓽNode(state.$representation) && state.$representation?.$hints?.underlying__data === error) {
			$representation = state.$representation
		} else {
			const builder = RichText.fragmentⵧblock()

			builder.pushHeading("Load error")
			builder.pushBlockFragment(`Error loading "${state.urlⵧload}":`)
			builder.pushBlockFragment(String(error))
			builder.addHints({ underlying__data: error })

			$representation = builder.done()
		}
	}
	assert(RichText.isꓽNodeLike($representation), `$representation should be a RichText.NodeLike!`)

	if (state.$representation !== $representation) {
		state = {
			...state,
			$representation: $representation,
		}

		const links = getꓽlinks($representation)

		const urlⵧself = getꓽuriⵧnormalized‿str(links[OHALinkRelation.self] || state.urlⵧload)
		/*if (urlⵧself !== state.urlⵧself) {
			state = {
				...state,
				urlⵧself,
			}
		}*/

		const urlⵧhome = getꓽuriⵧnormalized‿str(links[OHALinkRelation.home] || ROOT_URI)
		/*if (urlⵧhome !== state.urlⵧhome) {
			state = {
				...state,
				urlⵧhome,
			}
		}*/

		const linkⵧcontinue = links[OHALinkRelation.continueᝍto]
		if (linkⵧcontinue) {
			const linkⵧcontinue_str = getꓽuriⵧnormalized‿str(linkⵧcontinue)
			//assert(linkⵧcontinue_str !== state.urlⵧself, `linkⵧcontinue should not be the same as urlⵧself!`)
			assert(linkⵧcontinue_str !== state.urlⵧload, `linkⵧcontinue should not be the same as urlⵧload!`)
			state = navigate_to(state, linkⵧcontinue)
		}
	}

	return state
}

function navigate_to(
	state: Immutable<State>,
	options: {
		href?: OHAHyperLink‿x
		type?: "push" | "replace"
		reload?: boolean // force (re)load even if same url
	},
): Immutable<State> {
	DEBUG &&
		console.log(`↘ ${LIB}: navigate_to()`, {
			state: structuredClone(state),
			options,
		})

	const urlⵧself = getꓽurlⵧself(state)
	let { href = urlⵧself, type = "push", reload = false } = options
	assert(href, `navigate_to(): href should be defined!`)

	const target_str = getꓽuriⵧnormalized‿str(href)

	const isꓽsame_url = target_str === state.urlⵧload || target_str === urlⵧself
	if (isꓽsame_url && !reload) {
		return state // no change
	}

	return {
		...state,
		urlⵧload: target_str,
		//urlⵧself: target_str, // so far
		...(isꓽsame_url && reload && { reload_counter: state.reload_counter + 1 }),
		status_msg: getꓽstatus_msgꘌloading(target_str),
	}
}

/////////////////////////////////////////////////

function getꓽstatus_msgꘌloading(url: string): string {
	return `Loading: "${url}"…`
}

/////////////////////////////////////////////////

export { create, onꓽloaded, navigate_to }
