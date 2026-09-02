import { assert_from, assert } from "@monorepo-private/assert"
import { normalizeꓽpath } from "@monorepo-private/normalize-string"
import type { Immutable, PathⳇRelative } from "@monorepo-private/ts--types"

import { type TreeForRL, getꓽrepresentationⵧlinesⵧgeneric } from "../selectors--representation--lines.ts"

import {
	type FileSystemNode,
	type FileSystemNodeⳇFolder,
	isꓽFileSystemNodeⳇFolder,
	type FileSystemNodeⳇFile,
	isꓽFileSystemNodeⳇFile,
} from "./types.ts"

/////////////////////////////////////////////////

function getꓽparent__path<FilePayload, FolderPayload>(node: FileSystemNode<FilePayload, FolderPayload>): PathⳇRelative {
	let segments: string[] = []

	const { options } = node.root

	return "TODO getꓽparent__path()"
}

function getꓽnodeⵧby_path<FilePayload, FolderPayload>(
	tree: FileSystemNode<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): FileSystemNode<FilePayload, FolderPayload>
function getꓽnodeⵧby_path<FilePayload, FolderPayload>(
	tree: Immutable<FileSystemNode<FilePayload, FolderPayload>>,
	path: PathⳇRelative,
): Immutable<FileSystemNode<FilePayload, FolderPayload>>
function getꓽnodeⵧby_path<FilePayload, FolderPayload>(
	tree: FileSystemNode<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): FileSystemNode<FilePayload, FolderPayload> {
	path = normalizeꓽpath(path)
	const { options } = tree.root
	const segments = path.split(options.SEP)

	return segments.reduce((acc, segment) => {
		if (isꓽFileSystemNodeⳇFolder(acc)) {
			if (acc.childrenⵧfolders[segment]) {
				return acc.childrenⵧfolders[segment]!
			}

			if (acc.childrenⵧfiles[segment]) {
				return acc.childrenⵧfiles[segment]!
			}
		}

		throw new Error(`getꓽnode() could not find "${segment}" in "${getꓽparent__path(acc)}"!`)
	}, tree)
}

function getꓽnodeⵧby_pathⵧensure_folder<FilePayload, FolderPayload>(
	tree: FileSystemNode<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): FileSystemNodeⳇFolder<FilePayload, FolderPayload>
function getꓽnodeⵧby_pathⵧensure_folder<FilePayload, FolderPayload>(
	tree: Immutable<FileSystemNode<FilePayload, FolderPayload>>,
	path: PathⳇRelative,
): Immutable<FileSystemNodeⳇFolder<FilePayload, FolderPayload>>
function getꓽnodeⵧby_pathⵧensure_folder<FilePayload, FolderPayload>(
	tree: FileSystemNode<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): FileSystemNodeⳇFolder<FilePayload, FolderPayload> {
	const node = getꓽnodeⵧby_path(tree, path)
	assert(isꓽFileSystemNodeⳇFolder(node), `expected a folder node!`)
	return node
}

function getꓽnodeⵧby_pathⵧensure_file<FilePayload, FolderPayload>(
	tree: FileSystemNode<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): FileSystemNodeⳇFile<FilePayload, FolderPayload>
function getꓽnodeⵧby_pathⵧensure_file<FilePayload, FolderPayload>(
	tree: Immutable<FileSystemNode<FilePayload, FolderPayload>>,
	path: PathⳇRelative,
): Immutable<FileSystemNodeⳇFile<FilePayload, FolderPayload>>
function getꓽnodeⵧby_pathⵧensure_file<FilePayload, FolderPayload>(
	tree: FileSystemNode<FilePayload, FolderPayload>,
	path: PathⳇRelative,
): FileSystemNodeⳇFile<FilePayload, FolderPayload> {
	const node = getꓽnodeⵧby_path(tree, path)
	assert(isꓽFileSystemNodeⳇFile(node), `expected a file node!`)
	return node
}

/////////////////////////////////////////////////

class CTreeForRL<FilePayload, FolderPayload> implements TreeForRL {
	underlying_node: FileSystemNode<FilePayload, FolderPayload>
	segment: string
	type: "folder" | "file"

	constructor(underlying_node: FileSystemNode<FilePayload, FolderPayload>, segment: string, type: "folder" | "file") {
		this.underlying_node = underlying_node
		this.segment = segment
		this.type = type
	}

	isꓽroot() {
		return this.underlying_node.parent === null
	}

	getꓽrepresentationⵧlines(depth: number = 0) {
		return [`${this.type === "folder" ? "📁" : "📄"} ${this.segment || "<root>"}`]
	}

	getꓽchildren() {
		if (isꓽFileSystemNodeⳇFolder(this.underlying_node)) {
			const folder = this.underlying_node as FileSystemNodeⳇFolder<FilePayload, FolderPayload>
			return [
				...Object.keys(folder.childrenⵧfolders)
					.sort()
					.map((segment) => new CTreeForRL(folder.childrenⵧfolders[segment]!, segment, "folder")),
				...Object.keys(folder.childrenⵧfiles)
					.sort()
					.map((segment) => new CTreeForRL(folder.childrenⵧfiles[segment]!, segment, "file")),
			]
		}

		return []
	}
}

function getꓽrepresentationⵧlines<FilePayload, FolderPayload>(
	tree: Immutable<FileSystemNode<FilePayload, FolderPayload>>,
	getꓽpayload__representationⵧlines: (p: Immutable<FilePayload | FolderPayload | undefined>) => string[] = () => [],
): string[] {
	return getꓽrepresentationⵧlinesⵧgeneric(new CTreeForRL(tree, "", "folder"))
}

/////////////////////////////////////////////////

export { getꓽnodeⵧby_path, getꓽnodeⵧby_pathⵧensure_folder, getꓽnodeⵧby_pathⵧensure_file, getꓽrepresentationⵧlines }
