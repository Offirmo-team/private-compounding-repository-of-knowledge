import assert from '@monorepo-private/assert/v1'
import { Immutable } from '../embedded-deps/immutable.js'

import {
	Graph,

	Node, NodeUId, CustomNodeUId,
	Link, LinkUId, CustomLinkUId,

	Options,
} from './types.js'

/////////////////////////////////////////////////

// TODO unicode normalization?

function _assert_custom_id_is_valid(graph: Immutable<Graph>, cuid: CustomNodeUId | CustomLinkUId) {
	assert(cuid.length > 0, `A custom id should not be empty!`)
	assert(cuid.trim() === cuid, `A custom id should be trimmed!`)
}

function _assert_custom_node_id_is_valid(graph: Immutable<Graph>, node_cuid: CustomNodeUId) {
	_assert_custom_id_is_valid(graph, node_cuid)
	assert(!node_cuid.includes(graph.options.auto_link_id_separator), `A custom id should not include the separator!`)
}

/////////////////////////////////////////////////

export {
	_assert_custom_id_is_valid,
	_assert_custom_node_id_is_valid,
}
