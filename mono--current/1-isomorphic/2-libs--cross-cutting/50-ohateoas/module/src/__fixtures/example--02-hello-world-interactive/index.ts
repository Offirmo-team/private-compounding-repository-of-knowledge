import type {
	OHAHyperMedia,
	OHARichTextHints,
	OHAHyperActionBlueprint,
	OHAHyperAction,
	OHAPendingEngagement,
	OHAHyperLink,
	OHAHyper,
	OHAServer,
	OHAFeedback,
} from "@monorepo-private/ohateoas"
import { OHALinkRelation } from "@monorepo-private/ohateoas"
import * as RichText from "@monorepo-private/rich-text-format"
import { type InputSpec, type InputType, type ValueInputSpec } from "@monorepo-private/ts--types"
import { normalizeꓽuri‿str, getꓽscheme_specific_part } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

const DEBUG = true
const URI__ROOT = normalizeꓽuri‿str("")
const URI__GREET = normalizeꓽuri‿str("/greet")

/////////////////////////////////////////////////

interface State {
	username: string | undefined
}

const ACTION_ID_SET_USERNAME = "set_username"

/////////////////////////////////////////////////

const state: State = {
	username: undefined,
}

function createꓽserver(): OHAServer {
	const ↆget: OHAServer["ↆget"] = async (url = URI__ROOT) => {
		DEBUG && console.group(`↘ OHA ↆget("${url}")`)

		////////////
		const { path, query, fragment } = getꓽscheme_specific_part(url)
		DEBUG && console.log("URL after normalization:", { path, query, fragment })

		////////////
		let ꓺ$representation = RichText.fragmentⵧblock() // "block" bc maps to a ~frame/sub-browser

		const ꓺlinks: OHARichTextHints["links"] = {
			[OHALinkRelation.home]: state.username ? URI__GREET : URI__ROOT, // can be DEFAULT_ROOT_URI or sth else, ex. /user/:xyz/savegame/:xyz/
			[OHALinkRelation.self]: normalizeꓽuri‿str(path), // intentionally strip query & path until considered relevant
		}

		const ꓺactions: OHARichTextHints["actions"] = {}

		const ꓺengagements: OHARichTextHints["engagements"] = []

		////////////

		// Reminder
		// this is UI-based
		// we'll have a single user who wants to always be greeted by their name if they come back
		// this calls for a server side storage for long-term memory

		switch (path) {
			case URI__ROOT: {
				// root has an expectation to greet/introduce the rsrc/feature and to auto-redirect if needed
				ꓺ$representation = ꓺ$representation
					.pushHeading("OHA Greater")
					.pushText(state.username ? "Welcome back!" : "Welcome: How should I call you?")

				if (state.username) {
					// we already have the username, so we can go right to the greeting
					ꓺlinks[OHALinkRelation.continueᝍto] = URI__GREET
				}

				const username_input_spec: ValueInputSpec<string, OHAHyperMedia> = {
					kind: "value",
					type: "string--line",
					prompt: "How should I call you?",
					valueⵧdefault: "Stranger",
					valueⵧcurrent: state.username,
					normalizers: ["strⳇcoerce_blanks_to_single_spaces", "strⳇtrim", "strⳇcapitalizeⵧwords"],
					validators: {
						strⳇlengthⵧmin: {
							params: 1,
						},
					},
				}

				const prompt_for_username: OHAHyperActionBlueprint = {
					type: ACTION_ID_SET_USERNAME,
					input: {
						username: username_input_spec,
					},
					hints: {
						change_type: "update",
					},
					feedback: {
						[OHALinkRelation.continueᝍto]: URI__GREET,
					},
				}

				ꓺactions[prompt_for_username.type] = prompt_for_username
				break
			}

			case URI__GREET:
				ꓺ$representation = ꓺ$representation.pushText(`Hello, ${state.username}!`)
				break

			default:
				throw new Error(`404 on "${path}"!`)
		}

		////////////
		// wrap together
		ꓺ$representation.addHints<OHARichTextHints>({
			links: ꓺlinks,
			actions: ꓺactions,
			engagements: ꓺengagements,
		})

		DEBUG && console.groupEnd()

		return ꓺ$representation.done()
	}

	const dispatch: OHAServer["dispatch"] = async (action) => {
		switch (action.type) {
			case ACTION_ID_SET_USERNAME:
				// TODO server validation of the input of course
				state.username = action.payload.username
				break
			default:
				throw new Error(`Unsupported action "${action.type}"!`)
		}
	}

	return {
		ↆget,
		dispatch,
	}
}

/////////////////////////////////////////////////

export { createꓽserver }
