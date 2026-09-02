import assert from '@monorepo-private/assert/v1'
import { Immutable } from '../embedded-deps/immutable.js'

import { FileSystem, FSPath } from './types.js'


function normalize_path(fs: Immutable<FileSystem>, path: FSPath, type: 'file' | 'folder'): FSPath {
	const SEP = fs.options.separator

	// validate input
	const path‿split = path.split(SEP)
	assert(path‿split.every(p => !!p), `path should not have a hole! "${path}"`)
	if (type === 'file') {
		assert(!path.endsWith(SEP), `file path should not end with a separator! "${path}"`)
	}
	else {
		// no specific assertion
	}

	if (path.startsWith(SEP))
		path = path.slice(SEP.length)

	if (path.endsWith(SEP))
		path = path.slice(0, -SEP.length)

	return path
}

/////////////////////////////////////////////////

export {
	normalize_path,
}
