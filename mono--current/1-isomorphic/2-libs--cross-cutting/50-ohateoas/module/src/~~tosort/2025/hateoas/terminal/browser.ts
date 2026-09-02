import assert from '@monorepo-private/assert/v1'

import { getꓽcompareFnⵧby_string_key } from '@monorepo-private/ts--utils'
import { Immutable } from '@monorepo-private/state-utils'
import {
	type Uri‿str,
	type Hyperlink,
	type Hyperlink‿x,
	promote_toꓽhyperlink,
	normalizeꓽuri‿str,
	promote_toꓽscheme_specific_part,
} from '@monorepo-private/ts--types--web'
import * as RichText from '@monorepo-private/rich-text-format'
import { PendingEngagementUId } from '@oh-my-rpg/state--engagement'

import { prettifyꓽjson } from '../../services/misc.js'

import {
	StepType,
	type Step,
	type SelectStep,
	type StepIterator,
	type TaskProgressStep,
	type StepIteratorTNext,
	type StepIteratorYieldResult,
	type StepIteratorReturnResult,
} from '@monorepo-private/view--chat'

import {
	HATEOASPendingEngagement, type HATEOASServer} from '../../to-export-to-own-package/hateoas/types.js'
import {
	DEFAULT_ROOT_URI,
	getꓽCTA,
} from '../to-migrate.js'

/////////////////////////////////////////////////

const DEBUG = false

/////////////////////////////////////////////////

type ContentType = RichText.NodeLike

type StepClientTemp = {
	uid: PendingEngagementUId
}

class HypermediaBrowserWithChatInterface<ActionType> implements StepIterator<ContentType> {
	// hypermedia
	server: HATEOASServer<ContentType, ActionType>
	// see also view transition terminology entry/from
	routeⵧpending: Uri‿str | null = DEFAULT_ROOT_URI // requested but never loaded/refreshed/displayed yet
	routeⵧpending__flow: 'action' | undefined // TODO merge with above?
	routeⵧlast_displayed: Uri‿str | null = null // last hypermedia we displayed
	history: Array<Uri‿str> = [] // once a path is loaded it will go there. empty at first

	// chat interface
	pending_steps: Array<Step<ContentType>> = [] // convenience to allow gen_next_step() to yield several steps at once. FIFO (unshift/pop)
	stepsᐧcount_for_avoiding_infinite_loops = 0

	// misc
	status: 'starting' | 'nominal' | 'stopping' = 'starting'
	pending_async: Array<Promise<void>> = []

	constructor(server: HATEOASServer<ContentType, ActionType>) {
		this.server = server
	}

	/////////////////////////////////////////////////

	navigate_to(link: Hyperlink‿x, {
		from_action
	}: {
		from_action?: true
	} = {}) {
		const hyperlink = promote_toꓽhyperlink(link)
		const uri‿str = normalizeꓽuri‿str(hyperlink.href)

		// TODO enforce we're not "skipping routes" by chain-navigating with no Hypermedia display

		console.log(`\n【⇨ Navigating to: "${uri‿str}"…${hyperlink.rel.length ? (' (rel = ' + hyperlink.rel.join(',') + ')') : ''}】`)
		console.log('------------------------------------------------------')

		this.routeⵧpending = uri‿str
		this.routeⵧpending__flow = from_action
			? 'action'
			: undefined
	}

	is_engagement_queued_in_pending_steps(pe: Immutable<HATEOASPendingEngagement<ContentType, ActionType>>): boolean {
		return this.pending_steps.some(step => {
			const client_infos: StepClientTemp | undefined = step._client_temp as any // TODO type validation
			if (!client_infos)
				return false

			return client_infos.uid === pe.uid
		})
	}

	dispatch(action: Immutable<ActionType>, url?: Hyperlink['href']): Promise<void> {
		const pending = this.server.dispatch(action, url)
		return this.register_pending_async(pending)
	}

	get_chat_step_from_engagement(pe: Immutable<HATEOASPendingEngagement<ContentType, ActionType>>): Step<ContentType> {
		const { summary: $doc, ack_action: actionⵧack, uid } = pe

		const _this_browser = this

		const _client_temp: StepClientTemp = {
			uid,
		}

		// TODO improve depending on the format!
		const step: Step<ContentType> = {
			type: StepType.simple_message,
			msg: $doc as any, // cast away the immutability. TODO one day improve
			callback: () => actionⵧack && _this_browser.dispatch(actionⵧack),
			_client_temp,
		}

		return step
	}

	async register_pending_async(pending: Promise<void>): Promise<void> {
		this.pending_async.push(pending)

		return pending
			.finally(() => {
				this.pending_async = this.pending_async.filter(p => p !== pending)
			})
	}

	/////////////////////////////////////////////////
	// iterator (chat interface)
	next(p: StepIteratorTNext<ContentType>) {
		//console.log(`[next step?]`)
		this.stepsᐧcount_for_avoiding_infinite_loops++
		if (this.stepsᐧcount_for_avoiding_infinite_loops >= 10) {
			console.error('SCHEDULING EXIT because too many steps!')
			this.status = 'stopping'
		}

		const result = (this.status === 'stopping' && this.pending_steps.length === 0)
			? {
				value: undefined,
				done: true,
			} satisfies StepIteratorReturnResult<ContentType>
			: {
				value: this.gen_next_step(p),
				done: false,
			} satisfies StepIteratorYieldResult<ContentType>

		//console.log(`[next() now yielding...]`, result)
		return result
	}

	enqueue_engagement_steps(route: Uri‿str, type:
		| 'main--intro' | 'main--pre' | 'main--transition' | 'main--other'
		| 'other'
	) {
		const pending_engagementsⵧunprocessed = (() => {
			const pending_engagements =
				this.server.get_pending_engagements(
					route,
				)
			return pending_engagements
				.filter(pe =>
					!this.is_engagement_queued_in_pending_steps(pe))
		})()

		if (type.startsWith('main')) {
			// critical ones
			const pending_engagements__flowⵧmain = pending_engagementsⵧunprocessed.filter(pe => pe.flow === 'main')
			pending_engagements__flowⵧmain.forEach(e => {
				console.log(`found:`, e.uid, e.flow, e.sequence)
			})
			if (pending_engagements__flowⵧmain.length) {
				// those engagement are the MOST important, immediately queue them
				const relevant_engagements = pending_engagements__flowⵧmain
					.filter(e => {
						switch (e.sequence) {
							case 'intro':
								return type === 'main--intro'
							case 'transition':
								return type === 'main--transition'
							case 'pre':
								return type === 'main--pre'
							default:
								return type === 'main--other'
						}
					})
					.toSorted(
						getꓽcompareFnⵧby_string_key(e => e.sequence || '*', ['intro', 'transition', 'pre', '*'])
					)

				this.pending_steps.unshift(
					...relevant_engagements
						.map(this.get_chat_step_from_engagement, this)
				)
			}
			return
		}

		// less critical ones
		const pending_engagements__flowⵧnon_main =
			pending_engagementsⵧunprocessed.filter(pe => pe.flow !== 'main')
		pending_engagements__flowⵧnon_main.forEach(e => {
			console.log(`found:`, e.uid, e.flow, e.sequence)
		})
		this.pending_steps.unshift(
			...pending_engagements__flowⵧnon_main
				.toSorted(
					getꓽcompareFnⵧby_string_key('flow', ['side', 'not'])
				)
				.map(this.get_chat_step_from_engagement, this)
		)
	}

	async gen_next_step({ last_step, last_answer }: StepIteratorTNext<ContentType>): Promise<Step<ContentType>> {
		//console.log(`[gen_next_step()...] async start...`)

		// REMINDER: ideally we want everything in the HATEO**AS**
		// This is a BROWSER which should contain
		// as few app-specific behaviour as possible

		// extract generic local state
		const {
			routeⵧfrom, // route we're currently in (hypermedia last displaye) MAY equal route--target
			routeⵧtarget, // route we'll GET from, if we get there
			routeⵧback, // last previously visited route DIFFERENT from routeⵧtarget
			isꓽintro,
			isꓽtransition,
		} = (() => {
			const routeⵧpending = this.routeⵧpending
			const routeⵧfrom = this.routeⵧlast_displayed
			assert(routeⵧpending || routeⵧfrom)
			const routeⵧtarget = routeⵧpending || routeⵧfrom || DEFAULT_ROOT_URI // last || defaulting is for type only
			const routeⵧback = this.history.find(r => r !== routeⵧtarget)

			const pathⵧtarget = promote_toꓽscheme_specific_part(routeⵧtarget).path
			const pathⵧfrom = promote_toꓽscheme_specific_part(routeⵧfrom || DEFAULT_ROOT_URI).path

			const isꓽintro = (() => {
				// are we coming from a parent route?

				if (this.history.length === 0)
					return true // obviously

				return pathⵧtarget.startsWith(pathⵧfrom)
			})()

			// TODO clarify the concept = transition between what??
			const isꓽtransition = (() => {
				if (this.history.length === 0)
					return false // obviously

				if (isꓽintro)
					return false // obviously

				if (pathⵧtarget === pathⵧfrom) {
					// no change (or the only difference is in query or fragment)
					return false
				}

				// TODO clarify what a transition is!
				// ex. should it depend on the path?
				// are we coming from a sibling route?
				return true
			})()

			assert(!(isꓽintro && isꓽtransition), `should never be both intro and transition!`)

			return {
				routeⵧfrom,
				routeⵧtarget,
				routeⵧback,
				isꓽintro,
				isꓽtransition,
			}
		})()

		// needed? server-pushed? auto-refresh?
		if (routeⵧfrom) {
			//this.enqueue_engagement_steps(routeⵧfrom, 'other') // XXX clarify
		}

		if (this.pending_steps.length) {
			//console.log(`[gen_next_step()] steps pending=`, this.pending_steps.length)
			const step = this.pending_steps.pop()!
			/*console.log(`[gen_next_step()] ...yielding from pending:`,
				//prettifyꓽjson(step)
			)*/
			return step
		}

		const _this_browser = this

		// ok we have no more pending steps to display
		// we need to get new data
		// BUT first let's wait for pending running stuff (bc they are actions that may affect the data!)
		// TODO optimistic updates? OR it's the server responsibility?
		// TODO review, we should be able to transition and pre-load steps while waiting
		if (this.pending_async.length) {
			// TODO loader?? transition?
			// (need to inject the pending into transition)
			return {
				type: StepType.progress,
				msg_before: '[unfolding actions...]',
				promises: this.pending_async,
				msg_after: () => '[...done]',
			} as TaskProgressStep<ContentType>
		}

		const reset_infinite_loop_prevention = () => {
			this.stepsᐧcount_for_avoiding_infinite_loops = 0
		}

		console.log(`【${this.routeⵧpending === routeⵧfrom ? '(re)' : ''}fetching: "${this.routeⵧpending}"】`)

		// TODO loader and transitions here?

		// TODO re-fetch engagement?
		// if we're here, it means we no longer had pending engagements
		// and GET shouldn't create more
		// UNLESS SERVER-SIDE pushed ones??

		const hypermedia = await this.server.get(routeⵧtarget)
		if (routeⵧtarget !== this.history[0]) {
			this.history.unshift(routeⵧtarget)
		}

		// we'll display it soon!
		// let's just queue pre/post steps as well
		const step_content: Step<ContentType> = {
			type: StepType.simple_message,
			msg: hypermedia,
			callback: () => {
				_this_browser.routeⵧlast_displayed = routeⵧtarget
				_this_browser.routeⵧpending = null
				_this_browser.routeⵧpending__flow = undefined

				if (actionⵧlinkⵧcontinue) {
					_this_browser.navigate_to(actionⵧlinkⵧcontinue.link)
				}
			},
		}

		if (isꓽintro) this.enqueue_engagement_steps(routeⵧtarget, 'main--intro')
		if (isꓽtransition) this.enqueue_engagement_steps(routeⵧtarget, 'main--transition')
		this.enqueue_engagement_steps(routeⵧtarget, 'main--pre')

		this.pending_steps.unshift(step_content)

		this.enqueue_engagement_steps(routeⵧtarget, 'main--other')
		this.enqueue_engagement_steps(routeⵧtarget, 'other')

		const actions = RichText.renderⵧto_actions(hypermedia)
		const actionsⵧreducers = actions.filter(a => a.type === 'action')
		const actionsⵧlinks = actions
			.filter(a => a && a.type === 'hyperlink')
			.filter((ha: RichText.HyperlinkAction)=> {
				return !ha.link.rel.includes('self')
					&& promote_toꓽscheme_specific_part(ha.link.href).path !== this.routeⵧpending
			})
		const continue_links = actionsⵧlinks.filter(a => a.link.rel.includes('continue-to'))
		assert(continue_links.length <= 1, 'Should only have 0 or 1 continue-to links.')
		const actionⵧlinkⵧcontinue = continue_links[0]
		const actionsⵧbrowser: Array<RichText.HyperlinkAction> = [
			{
				type: 'hyperlink',
				$node: null as any, // extraneous TODO review this
				link: {
					href: DEFAULT_ROOT_URI,
					rel: [ 'home '],
					cta: '🏡  Home',
				},
			} satisfies RichText.HyperlinkAction,
			...(routeⵧback ? [{
				type: 'hyperlink',
				$node: null as any, // extraneous TODO review this
				link: {
					href: routeⵧback,
					rel: [ 'back '],
					cta: '🔙  Back',
				},
			} satisfies RichText.HyperlinkAction] : []),
			{
				type: 'hyperlink',
				$node: null as any, // extraneous TODO review this
				link: {
					href: DEFAULT_ROOT_URI,
					rel: [],
					cta: '👋  Quit', // TODO doesn't do anything yet ;)
				},
			} satisfies RichText.HyperlinkAction,
		]

		if (!actionⵧlinkⵧcontinue) {
			// we need user input to know what to do
			const step_input: SelectStep<ContentType, RichText.Action> = {
				type: StepType.select,
				prompt: 'What do you want to do?',
				options: Object.fromEntries([
					...actionsⵧreducers,
					...actionsⵧlinks,
					...actionsⵧbrowser,
				].map((v, i) => [
					String(i).padStart(2, '0'),
					{
						cta: getꓽCTA(v),
						value: v,
					} ])),
				callback(value) {
					//console.log('Callback!', prettifyꓽjson(value))
					reset_infinite_loop_prevention()

					switch (value.type) {
						case 'action': {
							_this_browser.dispatch(value.payload)
							if (value.href)
								_this_browser.navigate_to(value.href, { from_action: true })
							break
						}
						case 'hyperlink': {
							_this_browser.navigate_to(value.link, { from_action: true })
							break
						}
						default:
							throw new Error(`NIMP action type "${(value as any)?.type}"!`)
					}
				},
				msg_as_user: (action: RichText.Action) => `I select: ${getꓽCTA(action)}`,
				//msg_acknowledge: (action: RichText.Action) => `You selected: ${getꓽCTA(action)}`,
			}
			this.pending_steps.unshift(step_input)
		}

		/*console.log(`[gen_next_step()] ...yielding from hypermedia content:`,
			//prettifyꓽjson(step_content)
		)*/
		const step = this.pending_steps.pop()!
		assert(!!step)
		return step
	}

	//return?(value?: TReturn): IteratorResult<T, TReturn>;

	//throw?(e?: any): IteratorResult<T, TReturn>;
}

/////////////////////////////////////////////////

export {
	HypermediaBrowserWithChatInterface,
}
