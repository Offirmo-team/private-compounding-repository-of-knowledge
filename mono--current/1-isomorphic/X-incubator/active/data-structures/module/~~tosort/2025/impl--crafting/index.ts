import { expect } from 'chai'
import type { Immutable } from '@monorepo-private/ts--types'
import assert from '@monorepo-private/assert/v1'

import { LIB } from '../consts.ts'
import type {
	Graph,
	Node, NodeUId,
} from '../../types.ts'
import {
	type Rsrc,
	getꓽfull_fledged,
	createꓽgraphⵧmochi_cake,
} from '../../__examples/crafting--mochi-cake/index.ts'


/////////////////////////////////////////////////

interface Options {
}


interface CraftTree<Payload = Rsrc> extends Graph<Payload, undefined, Options> {
	generator_ofꓽUId: number

	// there are plenty of ways to store a graph
	// we decide to recursively link the nodes,
	// to make debugging easier
	root: CraftNode | undefined

	// also store nodes by uid for convenience
	// (ex. checking uid uniqueness)
	nodesⵧby_uid: {
		[uid: NodeUId]: CraftNode
	}
}

interface CraftNode<Payload = Rsrc> extends Node<Payload> {
	children: CraftNode[]
}

function createꓽnode(rsrcⵧraw: Immutable<Partial<Rsrc>>): CraftNode {
	const payload = getꓽfull_fledged(rsrcⵧraw)
	return {
		uid: payload.descr,
		payload,
		children: []
	}
}

function create(options: Options = {}): CraftTree {
	return {
		options,
		generator_ofꓽUId: 0,
		root: undefined,
		nodesⵧby_uid: {},
	}
}

function insertꓽnode(tree: CraftTree, rsrc: Partial<Rsrc>): CraftNode {
	const node = createꓽnode(rsrc)
	let { uid } = node
	if (node.payload.type === 'material') {
		uid = `material#${tree.generator_ofꓽUId}`
		tree.generator_ofꓽUId++
	}
	assert(!tree.nodesⵧby_uid[uid], `non-unique uid "${uid}"!`)

	// in-place mod, never mind...
	tree.root = tree.root ?? node
	tree.nodesⵧby_uid = {
		...tree.nodesⵧby_uid,
		[uid]: node,
	}

	return node
}

function insertꓽlink(tree: CraftTree, node_to: CraftNode, node_from: CraftNode): CraftTree {
	node_from.children.push(node_to)

	if (tree.root === node_to) {
		tree.root = node_from
	}

	return tree
}

function getꓽroot(tree: Immutable<CraftTree>): Immutable<CraftNode> | undefined {
	return tree.root
}

/////////////////////////////////////////////////

function getꓽrepresentationⵧlinesⵧpayload(rsrc: Rsrc, depth = 0): string[] {
	const result = []

	const { type, descr,  quantity } = rsrc

	if (depth === 0) {
		result.push(`〖${descr}〗`)
	}

	switch (type) {
		case 'material':
			result.push(`⊙ ${type}: ${descr} (${quantity.value}${quantity.unit ?? 'x'})`)
			break

		case 'tool':
			result.push(`⚒ ${descr}`)
			break

		case 'intermediateᝍstep': {
			if (rsrc.process) {
				result.push(`⊕ ${rsrc.process} => ⟢${descr}⟣`)
			}
			else {
				result.push(`⊕ ${descr}`)
			}
			break
		}

		default:
			throw new Error(`unknown type "${type}"!`)
	}

	return result
}

function _getꓽrepresentationⵧlines(node: Immutable<CraftNode>, prefix: string = '', depth = 0): string[] {
	const result = getꓽrepresentationⵧlinesⵧpayload(node.payload, depth).map(l => prefix + l)

	const { children } = node
	children.forEach((child, index) => {
		const r = _getꓽrepresentationⵧlines(child, '', depth + 1)
		const is_last_child = index === children.length - 1
		result.push(...r.map((l, i) => {
			const is_first_line = i === 0
			if (is_first_line) {
				if (is_last_child) {
					return '└ ' + l
				}
				else {
					return '├ ' + l
				}
			}

			if (is_last_child) {
				return '  ' + l
			}
			else {
				return '│ ' + l
			}
		}))
	})

	return result
}

function getꓽrepresentationⵧlines(tree: Immutable<CraftTree>): string[] {
	if (!tree.root) {
		return [ '[empty tree' ]
	}

	// TODO check orphans?
	// TODO check cycles?

	return _getꓽrepresentationⵧlines(tree.root)
}

/////////////////////////////////////////////////

function aggregate_materials(tree: Immutable<CraftTree>): Rsrc[] {
	const materials = Object.values(tree.nodesⵧby_uid).map(node => node.payload).reduce((acc, rsrc) => {
		if (rsrc.type === 'material') {
			if (!acc[rsrc.descr]) {
				acc[rsrc.descr] = rsrc
			}
			else {
				// add up
				throw new Error(`NIMP!`)
			}
		}

		return acc
	}, {} as { [descr: string]: Immutable<Rsrc> })

	return Object.values(materials)
}

/////////////////////////////////////////////////

describe(`${LIB} -- example -- craft (mochi cake)`, function() {

	it('should work', () => {
		const { graph, rsrc } = createꓽgraphⵧmochi_cake<CraftTree, CraftNode>(create, insertꓽnode, insertꓽlink)
		//console.log(graph)
		//console.log(rsrc)

		getꓽrepresentationⵧlines(graph).forEach(line => {
			console.log(line)
		})

		//console.log(aggregate_materials(graph))
	})
})
