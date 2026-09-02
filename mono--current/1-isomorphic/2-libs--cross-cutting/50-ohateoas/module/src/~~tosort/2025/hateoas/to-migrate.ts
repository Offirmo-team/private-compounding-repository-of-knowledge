// TODO move into dedicated package

import assert from '@monorepo-private/assert/v1'
import { Immutable } from '@monorepo-private/state-utils'
import {
	type Uri‿str,
	type Uri‿x,
	type SchemeSpecificURIPart,
	normalizeꓽuri‿str,
	promote_toꓽscheme_specific_part,
} from '@monorepo-private/ts--types--web'
import * as RichText from '@monorepo-private/rich-text-format'

/////////////////////////////////////////////////


function getꓽCTA(action: Immutable<RichText.Action>): string {
	switch (action.type) {
		case 'action': {
			if (action.cta)
				return '⚡️' + action.cta

			throw new Error('Missing CTA for action!')
		}
		case 'hyperlink': {
			if (action.link.cta)
				return '⇨ ' + action.link.cta

			throw new Error('Missing CTA for hyperlink!')
		}
		default:
			throw new Error(`NIMP action type "${(action as any)?.type}"!`)
	}
}

const DEFAULT_ROOT_URI: Uri‿str = normalizeꓽuri‿str('')

function getꓽactionsⵧreducers(actions: Array<RichText.Action>): Array<RichText.ReduceAction> {
	return actions.filter(a => a.type === 'action')
}

function getꓽactionsⵧlinks(actions: Array<RichText.Action>, {
	excluding_relꘌself = false, excluding_pathꘌ,
}: {
	excluding_relꘌself?: boolean
	excluding_pathꘌ?: SchemeSpecificURIPart['path']
} = {}): Array<RichText.HyperlinkAction> {
	return actions
		.filter(a => a && a.type === 'hyperlink')
		.filter((ha: RichText.HyperlinkAction)=> {
			return excluding_relꘌself
				? (!ha.link.rel.includes('self'))
				: true
		})
		.filter((ha: RichText.HyperlinkAction)=> {
			return excluding_pathꘌ
				? promote_toꓽscheme_specific_part(ha.link.href).path !== excluding_pathꘌ
				: true
		})
}
function getꓽactionⵧcontinue_to(actions: Array<RichText.Action>): RichText.HyperlinkAction | null {
	const continue_links = getꓽactionsⵧlinks(actions)
		.filter(a => a.link.rel.includes('continue-to'))
	assert(continue_links.length <= 1, 'Should only have 0 or 1 continue-to links.')
	return continue_links[0] ?? null
}

/////////////////////////////////////////////////

export {
	getꓽCTA,
	getꓽactionsⵧreducers,
	getꓽactionsⵧlinks,
	getꓽactionⵧcontinue_to,

	DEFAULT_ROOT_URI,
}
