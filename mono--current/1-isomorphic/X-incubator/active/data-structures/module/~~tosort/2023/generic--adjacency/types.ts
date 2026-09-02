
/////////////////////////////////////////////////

// since we implement Adjacency List storage through a map, all those ids should be strings
// we allow custom ids while also using smaller auto-generated internal ids under the hood
type NodeUId = string
type LinkUId = string
type CustomNodeUId = string
type CustomLinkUId = string

interface Options {
	is_arborescence: boolean // if yes, must be directed and no node can have 2 links pointing to it. Will unlock the "depth" property https://en.wikipedia.org/wiki/Tree_(graph_theory)#Rooted_tree

	is_directed: boolean // if not, links are auto-normalized (from->to) by alphabetical order
	allows_cycles: boolean // TODO DETECTION NOT IMPLEMENTED
	allows_loops: boolean // loop = link from/to the same node https://en.wikipedia.org/wiki/Loop_(graph_theory)
	allows_duplicate_links: boolean // https://en.wikipedia.org/wiki/Multiple_edges even if allowed, they must have uids (could implement further but no need at this stage)

	auto_link_id_separator: string // must not appear in node ids

	//get_unique_id: Function | undefined
}

interface Node {
	custom_id: CustomNodeUId // nodes MUST have a custom id

	uid: NodeUId

	links_from: LinkUId[]

	// TODO links_to? if useful

	depth?: number // optional, for arborescences
}

interface Link {
	custom_id?: CustomLinkUId // links don't require a custom id

	uid: LinkUId

	from: NodeUId
	to: NodeUId

	// TODO weight?
}

interface Graph {
	options: Options

	uid_generator: number

	nodes_by_uid: {
		[k: NodeUId]: Node
	}
	last_inserted_node‿uid: undefined | NodeUId

	links_by_uid: {
		[k: LinkUId]: Link
	}
	last_inserted_link‿uid: undefined | LinkUId

	nodes_uids_by_custom_id: {
		[k: CustomNodeUId]: NodeUId
	}

	links_uids_by_custom_id: {
		[k: CustomLinkUId]: LinkUId
	}
}

/////////////////////////////////////////////////

export {
	type Graph,

	type Node, type NodeUId, type CustomNodeUId,
	type Link, type LinkUId, type CustomLinkUId,

	type Options,
}
