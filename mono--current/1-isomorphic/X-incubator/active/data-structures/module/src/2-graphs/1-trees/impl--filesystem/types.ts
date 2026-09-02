import type { Basename, PathⳇRelative } from "@monorepo-private/ts--types"

import type { WithOptions, WithPayload } from "../../../1-common/types.ts"

/////////////////////////////////////////////////
// There are plenty of ways to store a graph.
// We decide to recursively link File System Nodes
// - to make debugging easier
// - to make recursion easier
// - to make dir moves easier
// Also no need for UID since the path is the UID
// We could not differentiate file/folder, but
// - it strengthens the typing
// - it avoid having to differentiate File & Folder payloads

interface FileSystemOptions {
	SEP: "/"
}

interface FileSystemNodeⳇBase<FilePayload, FolderPayload> {
	root: FileSystemRoot<FilePayload, FolderPayload> // to share options
	parent: FileSystemNodeⳇFolder<FilePayload, FolderPayload> | null // to be able to regen the full path (null if root)
}

interface FileSystemNodeⳇFile<FilePayload, FolderPayload>
	extends FileSystemNodeⳇBase<FilePayload, FolderPayload>, WithPayload<FilePayload> {}

// undefined payload allowed since we can insert multiple folders at once for convenience
interface FileSystemNodeⳇFolder<FilePayload, FolderPayload>
	extends FileSystemNodeⳇBase<FilePayload, FolderPayload>, WithPayload<FolderPayload | undefined> {
	// separating the children by type is very convenient
	childrenⵧfolders: { [basename: string]: FileSystemNodeⳇFolder<FilePayload, FolderPayload> }
	childrenⵧfiles: { [basename: string]: FileSystemNodeⳇFile<FilePayload, FolderPayload> }
}
function isꓽFileSystemNodeⳇFolder<FilePayload, FolderPayload>(
	x: FileSystemNodeⳇBase<FilePayload, FolderPayload>,
): x is FileSystemNodeⳇFolder<FilePayload, FolderPayload> {
	return x && (x as any).childrenⵧfolders && (x as any).childrenⵧfiles
}

type FileSystemNode<FilePayload, FolderPayload> =
	| FileSystemNodeⳇFile<FilePayload, FolderPayload>
	| FileSystemNodeⳇFolder<FilePayload, FolderPayload>
function isꓽFileSystemNodeⳇFile<FilePayload, FolderPayload>(
	x: FileSystemNodeⳇBase<FilePayload, FolderPayload>,
): x is FileSystemNodeⳇFile<FilePayload, FolderPayload> {
	return !isꓽFileSystemNodeⳇFolder(x)
}

interface FileSystemRoot<FilePayload, FolderPayload>
	extends FileSystemNodeⳇFolder<FilePayload, FolderPayload>, WithOptions<FileSystemOptions> {
	options: FileSystemOptions
	parent: null
}

// convenience aggregate type
// TODO clarify
interface Aggregated<FilePayload, FolderPayload> {
	basename: Basename
	type: "file" | "folder"
	pathⵧfrom_root: PathⳇRelative // inc. basename

	node: FileSystemNode<FilePayload, FolderPayload>
}

/////////////////////////////////////////////////

export {
	type FileSystemOptions,
	type FileSystemNodeⳇFile,
	isꓽFileSystemNodeⳇFile,
	type FileSystemNodeⳇFolder,
	isꓽFileSystemNodeⳇFolder,
	type FileSystemNode,
	type FileSystemRoot,
	type Aggregated,
}
