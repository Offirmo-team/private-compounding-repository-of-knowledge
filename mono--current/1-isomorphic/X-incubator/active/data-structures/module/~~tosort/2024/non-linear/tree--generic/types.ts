import { Immutable } from '../_vendor/@monorepo-private/ts--types/index.js'

/////////////////////////////////////////////////

// PRAGMATISM: Dual UID system:
// - we allow custom ids while also using smaller auto-generated internal ids under the hood
// - ex. a city graph would have "Paris", "Rome" etc. as custom ids, easy to reason about
// since we often need maps() for operations, all those ids should be strings
type UIdⳇInternal = string  // efficient, auto-generated UID
type UIdⳇCustom = string    // maybe inefficient BUT easy to read and understand UID


type NodeUIdⳇInternal = UIdⳇInternal
type NodeUIdⳇCustom = UIdⳇCustom


interface Tree<Payload, Meta = unknown> {
	generator_ofꓽUIdⳇInternal: number

	root‿uid: NodeUIdⳇInternal | undefined

	// IMPORTANT NOTE
	// THIS IS NOT a search tree
	// since storing the nodes as a hash is defeating the whole point of search trees = searching a key inside a set
	nodesⵧby_uid: {
		[k: NodeUIdⳇInternal]: TreeⳇNode<Payload, Meta>
	}
	last_inserted_node‿uid: undefined | NodeUIdⳇInternal // needed for

	nodes‿uidsⵧby_custom_id: {
		[k: NodeUIdⳇCustom]: NodeUIdⳇInternal
	}

	hooks: {
		normalizeꓽcustom_id: (raw: NodeUIdⳇCustom) => NodeUIdⳇCustom,
		isꓽcustom_idⵧvalid: (raw: NodeUIdⳇCustom) => boolean,
		getꓽrepresentationⵧtxtⵧ1line: (node: Immutable<TreeⳇNode<Payload, Meta>>, tree: Immutable<Tree<Payload, Meta>>) => string,
	}
}

interface TreeⳇNode<Payload, Meta = unknown> {
	// user case specific
	uidⵧcustom: NodeUIdⳇCustom
	payload: Payload

	// implementation specific
	_uid: NodeUIdⳇInternal
	_meta?: Meta // extra metadata such as red/black for ex.
	_children‿uid: NodeUIdⳇInternal[]
}

/////////////////////////////////////////////////

export {
	type NodeUIdⳇInternal,
	type NodeUIdⳇCustom,

	type Tree,
	type TreeⳇNode,
}
