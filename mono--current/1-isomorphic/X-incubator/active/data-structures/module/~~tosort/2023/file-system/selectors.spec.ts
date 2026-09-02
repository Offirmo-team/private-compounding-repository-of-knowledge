import { expect } from 'chai'

import { LIB } from './consts.js'

import {
	createꓽgraphⵧfile_system, mkdirp, upsertꓽfile,
	getꓽfilesⵧall,
	getꓽfoldersⵧall,
	getꓽchildren_of,
} from './index.js'

/////////////////////////////////////////////////

describe(`${LIB} -- selectors`, function() {

	it('should allow navigating the tree', () => {
		let fs = createꓽgraphⵧfile_system()

		fs = upsertꓽfile(fs, 'foo/bar/baz.xyz')
		fs = upsertꓽfile(fs, 'foo/glop.xyz')
		fs = mkdirp(fs, 'foo/bar/gnokman/')

		/*console.log({
			folders: getꓽfoldersⵧall(fs),
			files: getꓽfilesⵧall(fs),
			0: getꓽchildren_of(fs, '/'),
			1: getꓽchildren_of(fs, 'foo/'),
		})*/

		expect(getꓽfoldersⵧall(fs)).to.deep.equal([ 'foo/', 'foo/bar/', 'foo/bar/gnokman/' ])
		expect(getꓽfilesⵧall(fs)).to.deep.equal([ 'foo/bar/baz.xyz', 'foo/glop.xyz' ])
		expect(getꓽchildren_of(fs, '/')).to.deep.equal([ 'foo/' ])
		expect(getꓽchildren_of(fs, 'foo/')).to.deep.equal([ 'foo/bar/', 'foo/glop.xyz' ])

		//const empty_folders = get_empty_folders(fs)
	})
})
