import assert from '@monorepo-private/assert/v1'
import { Immutable } from '../../../_vendor/@monorepo-private/ts--types/index.js'
import { combine_normalizers, normalize_unicode, trim} from '../../../_vendor/@monorepo-private/normalize-string/index.js'

import {
	Tree, TreeⳇNode, NodeUIdⳇCustom, NodeUIdⳇInternal,
} from './types.js'
import {
	assertꓽcustom_idⵧis_valid,
	assertꓽcustom_idⵧis_not_taken,
	getꓽnode‿uidⵧby_custom_id,
} from './selectors.js'

/*import {
	_assert_custom_node_id_is_valid,
	_assert_custom_id_is_valid,
} from './utils.js'
import {
	getꓽnodeⵧby_custom_id,
} from './selectors.js'*/

/////////////////////////////////////////////////

const PAD_LENGTH = 3

function create<Payload, Meta = unknown>(options?: {
	hooks?: Partial<Tree<Payload, Meta>['hooks']>,
}): Immutable<Tree<Payload, Meta>> {
	return {
		generator_ofꓽUIdⳇInternal: 0,

		root‿uid: undefined,

		nodesⵧby_uid: {},
		last_inserted_node‿uid: undefined,
		nodes‿uidsⵧby_custom_id: {},

		hooks: {
			normalizeꓽcustom_id: combine_normalizers(
				normalize_unicode,
				trim,
			),
			isꓽcustom_idⵧvalid: (raw: NodeUIdⳇCustom) => true,
			getꓽrepresentationⵧtxtⵧ1line: (node, tree) => node.uidⵧcustom,
			...options?.hooks,
		}
	}
}

////////////////////////////////////

function _insertꓽnode<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, uidⵧcustom: NodeUIdⳇCustom, payload: Payload): Immutable<Tree<Payload, Meta>> {
	const _uid = `n${String(tree.generator_ofꓽUIdⳇInternal).padStart(PAD_LENGTH, '0')}`
	tree = {
		...tree,
		generator_ofꓽUIdⳇInternal: tree.generator_ofꓽUIdⳇInternal + 1,
	}

	const node: TreeⳇNode<Payload, Meta> = {
		uidⵧcustom,
		payload,

		// implementation specific
		_uid,
		//_meta: undefined, // TODO one day
		_children‿uid: [],
	}

	return {
		...tree,

		root‿uid: tree.root‿uid ?? _uid,

		nodesⵧby_uid: {
			...tree.nodesⵧby_uid,
			[_uid]: node as any, // TODO fix
		},
		last_inserted_node‿uid: _uid,

		nodes‿uidsⵧby_custom_id: {
			...tree.nodes‿uidsⵧby_custom_id,
			[uidⵧcustom]: _uid,
		},
	}
}

function insertꓽnode<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node‿cuid: NodeUIdⳇCustom, options: {
	parent?: NodeUIdⳇCustom,
	under?: NodeUIdⳇCustom,
	payload: Payload,
}): Immutable<Tree<Payload, Meta>> {
	node‿cuid = tree.hooks.normalizeꓽcustom_id(node‿cuid)
	assertꓽcustom_idⵧis_valid(tree, node‿cuid)
	assertꓽcustom_idⵧis_not_taken(tree, node‿cuid)

	const parent‿uid = (() => {
		if (!options) {
			return tree.root‿uid
		}

		if (options?.parent) {
			return getꓽnode‿uidⵧby_custom_id(tree, options.parent)
		}

		if (options?.under) {
			return getꓽnode‿uidⵧby_custom_id(tree, options.under)
		}

		return tree.root‿uid
	})()

	const payload = options?.payload! // TODO improve

	tree = _insertꓽnode<Payload, Meta>(tree, node‿cuid, payload)
	const node‿uid = tree.last_inserted_node‿uid!

	if (tree.root‿uid === node‿uid) {
		// the new node is the root bc it's the first one
		assert(!parent‿uid, `Intended parent should exist!`)
		return tree
	}

	// link the node to its parent
	assert(parent‿uid, `A parent should be provided!`)
	const nodeⵧparent = tree.nodesⵧby_uid[parent‿uid]
	assert(nodeⵧparent, `Intended parent should exist!`)

	tree = {
		...tree,
		nodesⵧby_uid: {
			...tree.nodesⵧby_uid,
			[parent‿uid]: {
				...nodeⵧparent,
				_children‿uid: [...nodeⵧparent._children‿uid, node‿uid].sort(),
			}
		}
	}

	return tree
}

// same arguments as insert
function upsertꓽnode<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node‿cuid: NodeUIdⳇCustom, options: Parameters<typeof insertꓽnode<Payload, Meta>>[2]): Immutable<Tree<Payload, Meta>> {
	node‿cuid = tree.hooks.normalizeꓽcustom_id(node‿cuid)

	if (tree.nodes‿uidsⵧby_custom_id[node‿cuid])
		return tree // no change

	return insertꓽnode(tree, node‿cuid, options)
}

////////////////////////////////////

/*
// insert all the nodes + links between them by index order
function upsertꓽbranch(graph: Immutable<Graph>, ...node_cuids: CustomNodeUId[]): Immutable<Graph> {
	node_cuids.forEach(node_cuid => {
		_assert_custom_node_id_is_valid(graph, node_cuid)
	})

	node_cuids.forEach((node_cuid, index) => {
		graph = upsertꓽnode(graph, node_cuid)

		if (index > 0) {
			// add the link TO this node
			const node_cuidⵧfrom = node_cuids[index - 1]!
			graph = upsertꓽlink(graph, node_cuidⵧfrom, node_cuid)
		}
	})

	return graph
}*/

/////////////////////////////////////////////////

export {
	create,

	insertꓽnode,
	upsertꓽnode,
}
