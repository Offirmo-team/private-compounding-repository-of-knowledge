import { expect } from 'chai'

import { LIB } from './consts.js'
import {
	Graph,
	createꓽgraphⵧgeneric,
	insertꓽnode, upsertꓽnode,
	insertꓽlink, upsertꓽlink,
	upsertꓽbranch,

	getꓽnodeⵧlast_inserted‿cuid,
	getꓽlinkⵧlast_inserted‿cuid,
} from './index.js'



/////////////////////////////////////////////////

describe(`${LIB} -- selectors`, function() {

	describe('getꓽnodeⵧlast_inserted‿cuid()', () => {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()

			expect(() => getꓽnodeⵧlast_inserted‿cuid(graph), 'DI0').to.throw('should have previously been inserted')

			graph = insertꓽnode(graph, 'Paris')
			expect(getꓽnodeⵧlast_inserted‿cuid(graph), 'DI1').to.equal('Paris')

			graph = insertꓽnode(graph, 'Rome')
			expect(getꓽnodeⵧlast_inserted‿cuid(graph), 'DI2').to.equal('Rome')

			// XXX TOREVIEW

			graph = upsertꓽnode(graph, 'Paris')
			expect(getꓽnodeⵧlast_inserted‿cuid(graph), 'UN').to.equal('Rome') // no change

			graph = upsertꓽbranch(graph, 'Sydney', 'Rome')
			expect(getꓽnodeⵧlast_inserted‿cuid(graph), 'UB').to.equal('Sydney')
		})
	})

	describe('getꓽlinkⵧlast_inserted‿cuid()', () => {

		it('should work', () => {
			let graph = createꓽgraphⵧgeneric()

			graph = insertꓽnode(graph, 'Paris')
			graph = insertꓽnode(graph, 'Rome')

			expect(() => getꓽlinkⵧlast_inserted‿cuid(graph), 'DI0a').to.throw('should have previously been inserted')

			graph = insertꓽlink(graph, 'Paris', 'Rome')
			expect(() => getꓽlinkⵧlast_inserted‿cuid(graph), 'DI0a').to.throw('should have a custom id')

			graph = insertꓽlink(graph, 'Paris', 'Rome', 'train')
			expect(getꓽlinkⵧlast_inserted‿cuid(graph), 'DI1').to.equal('train')

			graph = upsertꓽbranch(graph, 'Sydney', 'Rome')
			expect(() => getꓽlinkⵧlast_inserted‿cuid(graph), 'UB').to.throw('should have a custom id')
		})
	})
})
