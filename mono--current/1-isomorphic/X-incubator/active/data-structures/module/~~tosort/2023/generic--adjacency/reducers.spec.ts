import { expect } from 'chai'

import { LIB } from './consts.js'
import {
	Graph,
	createꓽgraphⵧgeneric,
	insertꓽnode, upsertꓽnode,
	insertꓽlink, upsertꓽlink,
} from './index.js'
import * as console from 'console'



/////////////////////////////////////////////////

describe(`${LIB} -- reducers`, function() {

	describe('create()', function () {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()
		})

		it('should have good defaults')
	})

	describe('insertꓽnode()', () => {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()

			graph = insertꓽnode(graph, 'Paris')
			graph = insertꓽnode(graph, 'Rome')

			expect(Object.keys(graph.nodes_uids_by_custom_id)).to.deep.equal(['Paris', 'Rome'])
		})

		it('should reject duplicates')
	})

	describe('upsertꓽnode()', () => {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()

			graph = upsertꓽnode(graph, 'Paris')
			let graph_unchanged = upsertꓽnode(graph, 'Paris')
			expect(graph_unchanged).to.equal(graph)

			expect(Object.keys(graph.nodes_uids_by_custom_id)).to.deep.equal(['Paris'])
		})

		it('should NOT reject duplicates')
	})

	describe('insertꓽlink()', () => {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()

			graph = insertꓽnode(graph, 'Paris')
			graph = insertꓽnode(graph, 'Rome')

			graph = insertꓽlink(graph, 'Paris', 'Rome')
			graph = insertꓽlink(graph, 'Paris', 'Rome', 'road')
			graph = insertꓽlink(graph, 'Paris', 'Rome', 'train')
		})

		it('should reject duplicates -- by id (auto)', () => {
			let graph = createꓽgraphⵧgeneric({
				//allows_duplicate_links: false,
			})

			graph = insertꓽnode(graph, 'Paris')
			graph = insertꓽnode(graph, 'Rome')

			graph = insertꓽlink(graph, 'Paris', 'Rome')
			expect(() => insertꓽlink(graph, 'Paris', 'Rome'), 'auto 1').to.throw('already exist')
			// reject bc normalized to Paris -> Rome since undirected graph
			expect(() => insertꓽlink(graph, 'Rome', 'Paris'), 'auto 2 -- normalized').to.throw('already exist')

			// allowed bc different id
			graph = insertꓽlink(graph, 'Paris', 'Rome', 'road')
			// should reject full equal
			expect(() => insertꓽlink(graph, 'Paris', 'Rome', 'road')).to.throw('already exist')
			expect(() => insertꓽlink(graph, 'Rome', 'Paris', 'road')).to.throw('already exist')

			// allowed bc different id
			graph = insertꓽlink(graph, 'Paris', 'Rome', 'train')

			//console.log(graph)
		})
	})

	describe('upsertꓽlink()', () => {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()

			graph = insertꓽnode(graph, 'Paris')
			graph = insertꓽnode(graph, 'Rome')

			graph = upsertꓽlink(graph, 'Paris', 'Rome')
			let graph_unchanged = upsertꓽlink(graph, 'Paris', 'Rome')
			expect(graph_unchanged).to.equal(graph)

			// same bc not directed
			graph_unchanged = upsertꓽlink(graph, 'Rome', 'Paris')
			expect(graph_unchanged).to.equal(graph)
		})
	})
})
