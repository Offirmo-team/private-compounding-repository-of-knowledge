import * as RichText from "@monorepo-private/rich-text-format"
import type { SemVer } from "@monorepo-private/ts--types"
import { normalizeꓽuri‿str, getꓽscheme_specific_part } from "@monorepo-private/ts--types--hypermedia"

import { OHALinkRelation } from "../../01-types/types.ts"
import type {
	OHAHyperMedia,
	OHARichTextHints,
	OHAHyperActionBlueprint,
	OHAHyperAction,
	OHAPendingEngagement,
	OHAHyperLink,
	OHAHyper,
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
			attention_needed: "notice",
			//auto_dismiss_delay_ms: 'normal',
			story: "Welcome to my game! This is a hobby game, no guarantee.",

			uid: -1,
		} as OHAPendingEngagement)

		// TODO recursive routing

		switch (path) {
			case ROOT_URI: {
				// root, expected to redirect
				$builder = $builder.pushText("Welcome to The Boring RPG!").pushLineBreak()

				// imagining a login screen, then continue on login

				links[OHALinkRelation.continueᝍto] = "/session/"

				break
			}

			case normalizeꓽuri‿str("/session/"): {
				// for recap
				// TODO review should be engagement instead?
				$builder = $builder.pushText("Loading...").pushLineBreak()

				// imagining a character/savegame selection, then continue to game

				links[OHALinkRelation.continueᝍto] = "/session/adventures/"

				break
			}

			case normalizeꓽuri‿str("/session/adventures/"): {
				$builder = $builder.pushBlockFragment("What do you want to do?")

				// NO recap of last adventure, it's a different route from when we play!

				/*
				if (AppState.is_inventory_full(state.u_state)) {
					$builder = $builder.pushNode(
						RichText.strong().pushText('Your inventory is full!').done(),
					)
					// TODO add action to sell worst items
					// TODO is it a blocker for playing?
				}*/

				//$builder = $builder.pushBlockFragment('You can play now!')
				/*
				if(AppState.getꓽavailable_energy‿float(state.t_state) >= 1) {
					$builder = $builder.pushBlockFragment('You can play now!')
				}
				else {
					$builder = $builder.pushBlockFragment('You can play again in ' + AppState.getꓽhuman_time_to_next_energy(state))
				}*/

				actions["play"] = {
					type: "play",

					hints: {
						change: "reduce",
						cta: "Play!",
						keyboard_shortcut: "P",
					},

					feedback: {
						tracking: "foreground", // (default) full "waiting/loading" UI, no other action can be sent until this one is resolved

						story: {
							message: "Exploring…",
							hints: {
								durationⵧmin‿ms: 1000, // if present, never resolve the action faster than this (illusion of labor) Do not abuse! (default to some value depending on the verb)
							},
						},
					} as OHAHyperActionBlueprint["feedback"],
				} as OHAHyperActionBlueprint

				links["equipment"] = URIꘌEQUIPMENT

				break
			}

			case "/session/adventures/last": {
				throw new Error(`Not implemented!`)

				links[OHALinkRelation.continueᝍto] = "/session/adventures/"

				break
			}

			default:
				throw new Error(`404 on "${path}"!`)
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
