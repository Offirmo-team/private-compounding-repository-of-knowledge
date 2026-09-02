import { assert_from, assert } from "@monorepo-private/assert"
import { normalizeꓽpath } from "@monorepo-private/normalize-string"
import type { PathⳇRelative } from "@monorepo-private/ts--types"

import { getꓽnodeⵧby_path, getꓽnodeⵧby_pathⵧensure_folder } from "./selectors.ts"
import type { FileSystemNodeⳇFile, FileSystemNodeⳇFolder, FileSystemRoot, FileSystemOptions } from "./types.ts"

/////////////////////////////////////////////////

function _createꓽnodeⵧFolder<FilePayload, FolderPayload>(
	root: FileSystemNodeⳇFolder<FilePayload, FolderPayload>["root"],
	parent: FileSystemNodeⳇFolder<FilePayload, FolderPayload>["parent"],
	payload: FileSystemNodeⳇFolder<FilePayload, FolderPayload>["payload"],
): FileSystemNodeⳇFolder<FilePayload, FolderPayload> {
	return {
		root,
		parent,
		payload,
		childrenⵧfolders: {},
		childrenⵧfiles: {},
	}
}

function _createꓽnodeⵧFile<FilePayload, FolderPayload>(
	root: FileSystemNodeⳇFile<FilePayload, FolderPayload>["root"],
	parent: FileSystemNodeⳇFile<FilePayload, FolderPayload>["parent"],
	payload: FileSystemNodeⳇFile<FilePayload, FolderPayload>["payload"],
): FileSystemNodeⳇFile<FilePayload, FolderPayload> {
	return {
		root,
		parent,
		payload,
	}
}

// yes, we do NOT return a "Root" type here
// to enforce the concept that file system nodes are relative and can be sliced at will
function createꓽfilesystem<FilePayload = undefined, FolderPayload = FilePayload>(
	options: FileSystemOptions = { SEP: "/" },
): FileSystemNodeⳇFolder<FilePayload, FolderPayload> {
	const underlying_FFT = _createꓽnodeⵧFolder<FilePayload, FolderPayload>(null as any, null, undefined)
	const result: FileSystemRoot<FilePayload, FolderPayload> = {
		...underlying_FFT,
		parent: null,
		options,
	}
	result.root = result
	return result
}

function insertꓽfile<FilePayload, FolderPayload>(
	tree: FileSystemNodeⳇFolder<FilePayload, FolderPayload>,
	path: PathⳇRelative,
	payload: FilePayload,
): PathⳇRelative {
	path = normalizeꓽpath(path, "file")
	const { options } = tree.root
	const segments = path.split(options.SEP)
	assert(segments.length > 0, `insertꓽfile() should provide at least a basename!`)
	const basename = segments.pop()!
	const folders = segments
	const parent: FileSystemNodeⳇFolder<FilePayload, FolderPayload> = (() => {
		if (folders.length === 0) {
			return tree
		} else {
			const folder_path = upsertꓽfolder<FilePayload, FolderPayload>(tree, folders.join(options.SEP))
			return getꓽnodeⵧby_pathⵧensure_folder<FilePayload, FolderPayload>(tree, folder_path)
		}
	})()
	assert(!parent.childrenⵧfolders[basename], `insertꓽfile() should not overwrite an existing folder!`)
	assert(!parent.childrenⵧfiles[basename], `insertꓽfile() should not overwrite an existing file!`)

	const file_node = _createꓽnodeⵧFile<FilePayload, FolderPayload>(tree.root, parent, payload)
	parent.childrenⵧfiles[basename] = file_node

	return path
}

function upsertꓽfolder<FilePayload, FolderPayload>(
	tree: FileSystemNodeⳇFolder<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): PathⳇRelative {
	path = normalizeꓽpath(path, "folder")
	const { options } = tree.root
	const segments = path.split(options.SEP)
	assert(segments.length > 0, `upsertꓽfolder() should provide at least 1 folder!`)

	let parent = tree
	segments.forEach((basename) => {
		assert(!parent.childrenⵧfiles[basename], `upsertꓽfolder() should not overwrite an existing file!`)
		if (!parent.childrenⵧfolders[basename]) {
			const folder_node = _createꓽnodeⵧFolder<FilePayload, FolderPayload>(tree.root, parent, undefined)
			parent.childrenⵧfolders[basename] = folder_node
		}
		parent = parent.childrenⵧfolders[basename]!
	})

	return path
}

/////////////////////////////////////////////////

export { createꓽfilesystem, insertꓽfile, upsertꓽfolder }
