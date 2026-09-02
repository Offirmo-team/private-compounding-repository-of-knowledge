import * as RichText from "@monorepo-private/rich-text-format"
import type { SemVer } from "@monorepo-private/ts--types"
import { normalizeꓽuri‿str, getꓽscheme_specific_part } from "@monorepo-private/ts--types--hypermedia"

import {
	type OHAHyperMedia,
	type OHARichTextHints,
	type OHAHyperActionBlueprint,
	type OHAHyperAction,
	type OHAPendingEngagement,
	type OHAHyperLink,
	type OHAHyper,
	OHALinkRelation,
} from "../../01-types/types.ts"
import { type OHAServer, ROOT_URI } from "../../30-server/index.ts"

/////////////////////////////////////////////////

const DEBUG = false

/////////////////////////////////////////////////

const URIꘌROOT = normalizeꓽuri‿str("/session/adventures/")

const URIꘌEQUIPMENT: OHAHyperLink = {
	href: "/session/equipment/",
	target: "character_sheet/equipment",
	rel: [],
	hints: {
		cta: "Manage equipment & inventory…",
	},
}

function createꓽserver(): OHAServer {
	const ↆget: OHAServer["ↆget"] = async (url = ROOT_URI) => {
		DEBUG && console.group(`↘ OHA ↆget("${url}")`)

		////////////
		const { path, query, fragment } = getꓽscheme_specific_part(url)
		DEBUG && console.log("URL after normalization:", { path, query, fragment })

		////////////
		// prepare aggregation
		let $builder = RichText.fragmentⵧblock() // "block" bc maps to a ~frame/sub-browser

		const links: OHARichTextHints["links"] = {
			[OHALinkRelation.self]: normalizeꓽuri‿str(path), // intentionally strip query & path until considered relevant
			[OHALinkRelation.home]: URIꘌROOT, // could be DEFAULT_ROOT_URI or sth else, ex. /user/:xyz/savegame/:xyz/
		}

		const actions: OHARichTextHints["actions"] = {}

		const engagements: OHARichTextHints["engagements"] = []

		////////////

		engagements.push({
			flow: "out",
			sequence: "session",
			attention_needed: "warning",
			story: "This is a demo of a broken server ;)",
			uid: -1,
		} as OHAPendingEngagement)

		switch (path) {
			case ROOT_URI: {
				// root, expected to redirect
				$builder = $builder.pushBlockFragment("What do you want to do?")

				actions["will-crash"] = {
					type: "will-crash",
				} as OHAHyperActionBlueprint

				actions["will-never-resolve"] = {
					type: "will-never-resolve",
				} as OHAHyperActionBlueprint

				links["404"] = "/missing-url"

				break
			}

			default:
				throw new Error(`404!`)
		}

		////////////
		// wrap together
		$builder.addHints<OHARichTextHints>({
			links,
			actions,
			engagements,
		})

		DEBUG && console.groupEnd()

		return $builder.done()
	}

	const dispatch: OHAServer["dispatch"] = async (action) => {
		console.log(`Server: asked to dispatch action…`, action)

		switch (action.type) {
			case "will-never-resolve":
				return new Promise((resolve) => {})
			default:
				throw new Error(`Unknown action type "${action.type}"!`)
		}
	}

	return {
		ↆget,
		dispatch,
	}
}

/////////////////////////////////////////////////

export { createꓽserver }
