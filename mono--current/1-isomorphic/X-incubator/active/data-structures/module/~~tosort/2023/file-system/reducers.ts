import assert from '@monorepo-private/assert/v1'
import { Immutable } from '../embedded-deps/immutable.js'

import * as GenericGraph from '../generic/index.js'

import { FSPath, FileSystem } from './types.js'
import { normalize_path } from './utils.js'

/////////////////////////////////////////////////

const SEP = '/'

function createꓽgraphⵧfile_system(): Immutable<FileSystem> {
	return {
		options: {
			separator: SEP,
		},
		graph: GenericGraph.createꓽgraphⵧgeneric({
			is_arborescence: true,
			//auto_link_id_separator: '→',
		}),
	}
}

// insert the file but upsert the path to it
function insertꓽfile(fs: Immutable<FileSystem>, path: FSPath): Immutable<FileSystem> {
	path = normalize_path(fs, path, 'file')

	assert(!fs.graph.nodes_uids_by_custom_id[path], 'file should not already exist!')

	return _upsertꓽpath(fs, path, 'file')
}

function upsertꓽfile(fs: Immutable<FileSystem>, path: FSPath): Immutable<FileSystem> {
	path = normalize_path(fs, path, 'file')

	return _upsertꓽpath(fs, path, 'file')
}

function mkdirp(fs: Immutable<FileSystem>, path: FSPath): Immutable<FileSystem> {
	path = normalize_path(fs, path, 'folder')

	return _upsertꓽpath(fs, path, 'folder')
}

function _upsertꓽpath(fs: Immutable<FileSystem>, path: FSPath, type: 'file' | 'folder'): Immutable<FileSystem> {
	const path‿split = path.split(SEP)

	const node_cuids = path‿split
		.map((last_segment, index) => {
			let path = path‿split.slice(0, index + 1).join(SEP)

			const is_last_segment = index === path‿split.length - 1
			if (!is_last_segment || type === 'folder')
				path += SEP

			return path
		})

	/*console.log({
		is_file,
		path,
		path‿split,
		node_cuids,
	})*/

	fs = {
		...fs,
		graph: GenericGraph.upsertꓽbranch(fs.graph, ...node_cuids),
	}

	return fs
}

/////////////////////////////////////////////////

export {
	createꓽgraphⵧfile_system,

	upsertꓽfile,
	mkdirp,
}
