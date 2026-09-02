import type { Immutable } from '@monorepo-private/ts--types'
import { type Hyper, type Hyperlink, promote_toꓽhyperlink } from '@monorepo-private/ts--types--web'

import {
	type BaseRenderingOptions,
	type WalkerCallbacks,
	walk,
	DEFAULT_RENDERING_OPTIONSⵧWalk,
} from '../walk.ts'
import type { CheckedNode, NodeLike } from '../../l1-types/index.ts'

/////////////////////////////////////////////////

interface BaseAction {
	$node: Immutable<CheckedNode> // the node where this action was found TODO review needed?

	// TODO add UI options? ex. pretend to work?
	// or an auto engagement? (see state--engagement)
	// should it be embedded in the action or early-returned by the HATEOAS server?
}

interface HyperlinkAction extends BaseAction {
	type: 'hyperlink'
	link: Hyperlink

	// TODO meta data? TODO identify use cases
}

// the final action yielded by this renderer
interface ReduceAction extends BaseAction {
	type: 'reduce' // in the sense of reducer(action)
	action: Hyper
}

type Action =
	| HyperlinkAction
	| ReduceAction

interface RenderingOptionsⵧToActions extends BaseRenderingOptions {
	getꓽactions: (node: Immutable<CheckedNode>) => Action[] // will be executed on every node
}

const DEFAULT_RENDERING_OPTIONSⵧToActions= Object.freeze<RenderingOptionsⵧToActions>({
	...DEFAULT_RENDERING_OPTIONSⵧWalk,
	getꓽactions: ($node) => {
		const actions: Action[] = []

		if ($node.$hints['href']) {
			// this node is a hyperlink to something
			const raw_link = $node.$hints['href']
			// TODO promote
			const hyperlink: Hyperlink = promote_toꓽhyperlink(raw_link, {
				// TODO default CTA from $node itself?
			})
			actions.push({
				$node,
				type: 'hyperlink',
				link: hyperlink,
			})
		}

		if ($node.$hints['actions']) {
			actions.push(...$node.$hints['actions'].map((action: Hyper): ReduceAction => {
				return {
					// TODO default CTA from $node itself
					$node,
					type: 'reduce',
					action,
				}
			}))
		}

		if ($node.$hints['links']) {
			actions.push(...Object.values<any>($node.$hints['links']).map((link: Hyperlink): HyperlinkAction => {
				return {
					$node,
					type: 'hyperlink',
					link,
				}
			}))
		}

		return actions
	},
})

type WalkState = {
	actions: Action[],
}

const create_state: WalkerCallbacks<WalkState, RenderingOptionsⵧToActions>['create_state'] = () => {
	return {
		actions: [],
	}
}

const on_type: WalkerCallbacks<WalkState, RenderingOptionsⵧToActions>['on_type'] = ({$type, state, $node, depth}, { getꓽactions }) => {
	//console.log('[on_type]', { $type, state })

	state.actions.push(...getꓽactions($node))

	return state
}

const on_concatenateⵧsub_node: WalkerCallbacks<WalkState, RenderingOptionsⵧToActions>['on_concatenateⵧsub_node'] = ({state, sub_state}) => {
	state.actions = state.actions.concat(...sub_state.actions)

	return state
}

const on_concatenateⵧstr: WalkerCallbacks<WalkState, RenderingOptionsⵧToActions>['on_concatenateⵧstr'] = ({state, str}) => {
	// nothing
	return state
}

const callbacksⵧto_actions: Partial<WalkerCallbacks<WalkState, RenderingOptionsⵧToActions>> = {
	create_state,
	on_concatenateⵧstr,
	on_concatenateⵧsub_node,
	on_type,
}

function renderⵧto_actions($doc: Immutable<NodeLike>, options: Partial<RenderingOptionsⵧToActions> = {}): Action[] {
	if (typeof $doc !== 'object') {
		return []
	}
	const full_options: RenderingOptionsⵧToActions = {
		...DEFAULT_RENDERING_OPTIONSⵧToActions,
		...options,
	}
	return walk<WalkState, RenderingOptionsⵧToActions>($doc, callbacksⵧto_actions, full_options).actions
}

/////////////////////////////////////////////////

export {
	type HyperlinkAction,
	type ReduceAction, type EmbeddedReducerAction,
	type Action,
	type RenderingOptionsⵧToActions,

	DEFAULT_RENDERING_OPTIONSⵧToActions,

	renderⵧto_actions,

	callbacksⵧto_actions,
}
