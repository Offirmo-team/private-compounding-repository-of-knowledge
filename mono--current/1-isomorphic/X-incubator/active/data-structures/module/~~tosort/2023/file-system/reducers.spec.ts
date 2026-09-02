import { expect } from 'chai'

import { LIB } from './consts.js'

import {
	createꓽgraphⵧfile_system,
	upsertꓽfile,
	mkdirp,
} from './index.js'
import {
	getꓽrepresentationⵧarborescence
} from '../generic/index.js'


describe(`${LIB} -- reducers`, function() {

	it('should work', () => {
		let fs = createꓽgraphⵧfile_system()

		fs = upsertꓽfile(fs, 'foo/bar/baz.xyz')
		fs = upsertꓽfile(fs, 'foo/glop.xyz')
		fs = mkdirp(fs, 'foo/bar/gnokman/')

		//console.log(fs)
		console.log(getꓽrepresentationⵧarborescence(fs.graph))
	})

	it('should reject duplicates')


})
