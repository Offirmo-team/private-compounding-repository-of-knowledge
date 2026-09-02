import { type TimestampUTCMs, getꓽUTC_timestamp‿ms } from '@monorepo-private/timestamps'
import {
	normalizeꓽuri‿str,
	getꓽscheme_specific_part,
	type ReducerAction,
} from '@monorepo-private/ts--types--hypermedia'
import * as RichText from '@monorepo-private/rich-text-format'
import {
	ROOT_URI,
	type OHARichTextHints,
	type OHAServer,
	type OHAStory,
	type OHAHyperActionBlueprint,
	type OHAFeedback, OHALinkRelation, type OHAHyperLink, type OHAPendingEngagement, type OHAHyperMedia,
} from '@monorepo-private/ohateoas'
import {ActionType, createꓽall_store_fns} from '@tbrpg/interfaces'
import * as UIRT from '@tbrpg/ui--rich-text'
import * as TBRPGState from "@tbrpg/state";
import {will_next_play_be_good_at} from "@tbrpg/state";

/////////////////////////////////////////////////


/////////////////////////////////////////////////

const DEBUG = true

/////////////////////////////////////////////////

const URIꘌROOT = normalizeꓽuri‿str('/session/adventures/')

const URIꘌEQUIPMENT: OHAHyperLink = {
	href: '/session/equipment/',
	target: 'character_sheet/equipment',
	rel: [],
	hints: {
		cta: 'Manage equipment & inventory…',
	}
}

interface PromptFragment {
	type?: 'system' | 'user'
	text: string
}

function createꓽserver(): OHAServer {
	// In this demo, the state is LOCAL
	const all_store_fns = createꓽall_store_fns()


	const ↆget: OHAServer['ↆget'] = async (url = ROOT_URI) => {
		DEBUG && console.group(`↘ OHA ↆget("${url}")`)

		////////////
		const { path, query, fragment } = getꓽscheme_specific_part(url)
		DEBUG && console.log('URL after normalization:', { path, query, fragment })

		////////////
		// prepare aggregation
		let $builder = RichText.fragmentⵧblock() // "block" bc maps to a ~frame/sub-browser

		const links: NonNullable<OHARichTextHints['links']> = {
			[OHALinkRelation.self]: normalizeꓽuri‿str(path), // intentionally strip query & path until considered relevant
			[OHALinkRelation.home]: URIꘌROOT, // could be DEFAULT_ROOT_URI or sth else, ex. /user/:xyz/savegame/:xyz/
		}

		const actions: NonNullable<OHARichTextHints['actions']> = {
		}

		const engagements: NonNullable<OHARichTextHints['engagements']> = []

		const prompt: Array<PromptFragment> = []
		prompt.push({ text: `
You're playing a video game "The Boring RPG",
a fantasy RPG where you play as a hero and try to maximise your power and explore all the game features.` })

		////////////

		const state = all_store_fns.getSnapshot()

		const $recap = UIRT.getꓽrecap(state.u_state)
		prompt.push({text: RichText.renderⵧto_text($recap)})

		const pending_engagements = TBRPGState.getꓽpending_engagements(state.u_state)
		pending_engagements.forEach(pe => {
			engagements.push(pe as any) // TODO immu
		})

		// TODO 1D recursive routing
		switch (path) {
			case ROOT_URI: { // root, expected to redirect
				// imagining a login screen, then continue on login

				$builder = $builder
					.pushText('Welcome to The Boring RPG!')
					//.pushLineBreak() TODO should be auto sep

				links[OHALinkRelation.continueᝍto] = '/session/'

				break
			}

			case normalizeꓽuri‿str('/session/'): { // for recap
				// imagining a character/savegame selection, then continue to game
				// TODO review should be engagement instead?
				$builder = $builder
					.pushNode($recap, { id: 'recap'})
				//.pushLineBreak() TODO should be auto sep

				links[OHALinkRelation.continueᝍto] = '/session/adventures/'

				break
			}

			case normalizeꓽuri‿str('/session/adventures/'): {
				$builder = $builder.pushBlockFragment('What do you want to do?')

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

				if (TBRPGState.is_inventory_full(state.u_state)) {
					xxx
					{
						msg_main: 'Your inventory is full! You can’t play until you make some space.',
							choices: [
						{
							msg_cta: 'Manage Inventory (equip, sell…)',
							value: 'inventory',
							msgg_as_user: () => 'Let’s sort out my stuff.',
							callback: () => game_instance.view.set_state(() => ({mode: 'inventory'})),
						},
					],
					}
				}

				actions['play'] = {
					type: 'play',

					hints: {
						change: 'reduce',
						cta: 'Play!',
						keyboard_shortcut: 'P',
					},

					feedback: {
						tracking: 'foreground', // (default) full "waiting/loading" UI, no other action can be sent until this one is resolved

						story: {
							message: 'Exploring…',
							messageⵧllm: '', // no use
							hints: {
								durationⵧmin‿ms: 1000, // if present, never resolve the action faster than this (illusion of labor) Do not abuse! (default to some value depending on the verb)
							},
						}
					} as OHAHyperActionBlueprint['feedback'],
				} as OHAHyperActionBlueprint

				links['equipment'] = URIꘌEQUIPMENT

				break
			}

			case '/session/adventures/last': {
				throw new Error(`Not implemented!`)

				links[OHALinkRelation.continueᝍto] = '/session/adventures/'

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

	const dispatch: OHAServer['dispatch'] = async (action: ReducerAction) => {
		// reminder that the action contains its own feedback!

		const now_ms = getꓽUTC_timestamp‿ms()
		console.log(`Server: asked to dispatch action…`, { action, now_ms })
		action = {
			now_ms,
			...action
		}

		let result_story: OHAStory | undefined = undefined

		const state = all_store_fns.getSnapshot()

		switch (action.type) {
			case ActionType['play']: {
				if (TBRPGState.is_inventory_full(state.u_state)) {
					result_story = {
						kind: 'unit',
						role: 'assistant',
						message: 'Your inventory is full! You can’t play until you make some space.',
					}
				} else {
					const is_good = TBRPGState.will_next_play_be_good_at(state, now_ms)

					if (!is_good) {
						// interrupt
						throw new Error(`Not implemented!`)
					} else {
						result_story = {
							kind: 'unit',
							role: 'assistant',
							message: 'Encountered something!',
							hints: {
								[OHALinkRelation.continueᝍto]: '/session/adventures/last'
							}
						}
					}
				}
				break
			}

			default:
				break
		}

		all_store_fns.dispatch(action)


		return result_story
	}

	return {
		ↆget,
		dispatch,
	}
}

/////////////////////////////////////////////////

export {
	createꓽserver,
}
