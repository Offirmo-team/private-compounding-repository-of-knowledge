import assert from '@monorepo-private/assert/v1'
import { type Immutable } from '@monorepo-private/ts--types'

import { getꓽmutable_copy } from '@monorepo-private/state-utils'
import {
	type NodeLike,
	type Node,
	type StrictNode,
	createⵧfrom_content,
} from '@monorepo-private/rich-text-format'
import {
	type TrackedEngagement,
	type PendingEngagementUId,
} from '@oh-my-rpg/state--engagement'

import { type HATEOASPendingEngagement } from './types.js'

/////////////////////////////////////////////////

const EXPECTED_FIELDS = new Set(['$sub', '$hints'])
function assertꓽparams__shape(params: TrackedEngagement<NodeLike>['params']): Pick<StrictNode, '$sub' | '$hints'> {
	const result: Pick<StrictNode, '$sub' | '$hints'> = {
		$sub: {},
		$hints: {},
	}

	const keys = Object.keys(params)
	keys.forEach(k => {
		assert(EXPECTED_FIELDS.has(k), `a HATEOAS RichText TrackedEngagement params should not contain extraneous fields! ("${k}")`)
	})

	result.$sub = {
		...params?.['$sub'],
	}
	result.$hints = {
		...params?.['$hints'],
	}

	return result
}

function resolveꓽrich_text_pending_engagement<Action>(
	pe: Immutable<TrackedEngagement<NodeLike>>,
	uid_to_ack: (uid: PendingEngagementUId) => Immutable<Action>,
): Immutable<HATEOASPendingEngagement<Node, Action>> {
	const template__contentⵧmutable = getꓽmutable_copy(pe.template.content)

	const builder = createⵧfrom_content(template__contentⵧmutable)
	const extras = assertꓽparams__shape(pe.params)
	builder.pushRawNodes(extras.$sub)
	builder.addHints(extras.$hints)

	/*console.warn(`XXX`, {
		raw_params: pe.params,
		extras,
		content: builder.done(),
	})*/

	return {
		summary: builder.done(),
		flow: pe.template.flow,
		role: pe.template.role,
		...(pe.template.success !== undefined && { success: pe.template.success }),
		...(pe.template.attention_needed !== undefined && { attention_needed: pe.template.attention_needed }),
		...(pe.template.enhancements !== undefined && { ...pe.template.enhancements }),

		ack_action: uid_to_ack(pe.uid),
		uid: pe.uid,
	}
}


/////////////////////////////////////////////////

export {
	resolveꓽrich_text_pending_engagement,
}
