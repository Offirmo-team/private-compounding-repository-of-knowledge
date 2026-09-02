import assert from '@monorepo-private/assert/v1'
import { Immutable } from '../../../_vendor/@monorepo-private/ts--types/index.js'


import {
	Tree,
	NodeUIdⳇCustom,
	NodeUIdⳇInternal,
	TreeⳇNode,
} from './types.js'

/*import {
	_assert_custom_node_id_is_valid
} from './utils.js'*/

/////////////////////////////////////////////////

function assertꓽcustom_idⵧis_valid<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node‿cuid: NodeUIdⳇCustom): void {
	assert(
		tree.hooks.isꓽcustom_idⵧvalid(node‿cuid),
		`Custom id "${node‿cuid}" should be valid!`
	)
}

function getꓽnode‿uidⵧby_custom_id<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node‿cuid: NodeUIdⳇCustom): NodeUIdⳇInternal {
	node‿cuid = tree.hooks.normalizeꓽcustom_id(node‿cuid)
	assertꓽcustom_idⵧis_valid(tree, node‿cuid)

	const node‿uid = tree.nodes‿uidsⵧby_custom_id[node‿cuid]
	assert(node‿uid, `Node with cuid "${node‿cuid}" should exist!`)

	return node‿uid
}

function assertꓽcustom_idⵧis_not_taken<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node‿cuid: NodeUIdⳇCustom): void {
	assert(
		!tree.nodes‿uidsⵧby_custom_id[node‿cuid],
		`Custom id "${node‿cuid}" should not be already taken!`
	)
}

function getꓽnodeⵧby_custom_id<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node_cuid: NodeUIdⳇCustom): Immutable<TreeⳇNode<Payload, Meta>> {
	const node_uid = getꓽnode‿uidⵧby_custom_id(tree, node_cuid)

	const node = tree.nodesⵧby_uid[node_uid]
	assert(node, `A node should exist for the custom id!`)

	return node
}

function getꓽnodeⵧroot<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>): Immutable<TreeⳇNode<Payload, Meta>> {
	assert(tree.root‿uid, `At last one node should have previously been inserted!`)

	return tree.nodesⵧby_uid[tree.root‿uid]!
}

function getꓽnodesⵧchildren_of<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node: Immutable<TreeⳇNode<Payload, Meta>> | 'root'): Immutable<TreeⳇNode<Payload, Meta>>[] {
	const nodeⵧparent = node === 'root' ? getꓽnodeⵧroot(tree) : node

	return nodeⵧparent._children‿uid
			.map(node_uid => tree.nodesⵧby_uid[node_uid]!)
}

function getꓽnode__representationⵧtxtⵧ1line<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, node: Immutable<TreeⳇNode<Payload, Meta>>): string {
	return tree.hooks.getꓽrepresentationⵧtxtⵧ1line(node, tree)
}

/*
// pre-condition that a root node was inserted. Will throw otherwise.
function getꓽnodeⵧroot‿cuid(tree: Immutable<Tree<any>>): NodeUIdⳇCustom {
	assert(tree.root, `A node should have previously been inserted!`)

	return graph.nodes_by_uid[graph.last_inserted_node‿uid]!.custom_id
}


// pre-condition that a node was inserted. Will throw otherwise.
// will NOT work with UPsert!
function getꓽnodeⵧlast_inserted‿cuid(graph: Immutable<Graph>): CustomNodeUId {
	assert(graph.last_inserted_node‿uid, `A node should have previously been inserted!`)

	return graph.nodes_by_uid[graph.last_inserted_node‿uid]!.custom_id
}
/*




function getꓽnodesⵧall‿cuid(graph: Immutable<Graph>): CustomNodeUId[] {
	return Object.keys(graph.nodes_uids_by_custom_id)
}

// a source vertex is a vertex with indegree zero https://en.wikipedia.org/wiki/Vertex_(graph_theory)#Types_of_vertices
function getꓽnodesⵧsource(graph: Immutable<Graph>): Immutable<Node>[] {
	const nodes_with_links_to = new Set<NodeUId>()

	Object.values(graph.links_by_uid).forEach(link => {
		nodes_with_links_to.add(link.to)
	})

	return Object.values(graph.nodes_by_uid).filter(node => !nodes_with_links_to.has(node.uid))
}



// arborescences only!
function getꓽnodesⵧby_depth(graph: Immutable<Graph>, depth: number): Immutable<Node>[] {
	assert(graph.options.is_arborescence, `Should be an arborescence!`)

	return Object.values(graph.nodes_by_uid).filter(node => node.depth === depth)
}


/////////////////////////////////////////////////

// pre-condition that a link was inserted. Will throw otherwise.
// pre-condition that the link was inserted WITH A CUSTOM UID (or else why accessing it?). Will throw otherwise.
// will NOT work with UPsert!
function getꓽlinkⵧlast_inserted‿cuid(graph: Immutable<Graph>): CustomLinkUId {
	assert(graph.last_inserted_link‿uid, `A link should have previously been inserted!`)
	const link = graph.links_by_uid[graph.last_inserted_link‿uid]!
	assert(link.custom_id, `The last inserted link should have a custom id!`)

	return link.custom_id
}
*/
/////////////////////////////////////////////////

function getꓽrepresentationⵧtxt<Payload, Meta = unknown>(tree: Immutable<Tree<Payload, Meta>>, start‿cuid?: NodeUIdⳇCustom): string {
	const nodeⵧroot‿uid = start‿cuid
		? getꓽnodeⵧby_custom_id(tree, start‿cuid)._uid
		: tree.root‿uid
	assert(nodeⵧroot‿uid, `A root node should exist!`)

	return _getꓽrepresentationⵧtxt(tree, tree.nodesⵧby_uid[nodeⵧroot‿uid]!, 0, true, '')
}

function _getꓽrepresentationⵧtxt<Payload, Meta>(tree: Immutable<Tree<Payload, Meta>>, node: Immutable<TreeⳇNode<Payload, Meta>>, depth: number, is_last: boolean, padding: string): string {
	return [
		 `${padding}${depth === 0?'●':is_last?'└':'├'} ${getꓽnode__representationⵧtxtⵧ1line(tree, node)}`, // [${node.uid}]  (${node.depth})
		...getꓽnodesⵧchildren_of(tree, node)
			.map((child_node, i, a) => _getꓽrepresentationⵧtxt(
				tree,
				child_node,
				depth + 1,
				i === a.length - 1,
				padding + (is_last ? '  ' : '│ ')
			)),
	].join('\n')
}

/////////////////////////////////////////////////

export {
	assertꓽcustom_idⵧis_valid,
	assertꓽcustom_idⵧis_not_taken,

	getꓽnode‿uidⵧby_custom_id,

	getꓽnodeⵧby_custom_id,
	getꓽnodesⵧchildren_of,

	getꓽrepresentationⵧtxt,
}
