import type { PathⳇRelative } from "@monorepo-private/ts--types"

import { createꓽgraph } from "../../../../__examples/fs--foo-bar-gnokman/index.ts"
import {
	type FileSystemNodeⳇFolder,
	createꓽfilesystem,
	insertꓽfile,
	upsertꓽfolder,
	type FileSystemRoot,
} from "../../index.ts"

/////////////////////////////////////////////////

interface FilePayload {}
interface FolderPayload {}

function createⵧsub(): FileSystemNodeⳇFolder<FilePayload, FolderPayload> {
	type Graph = FileSystemNodeⳇFolder<FilePayload, FolderPayload>
	const { graph, ...rest } = createꓽgraph<Graph>(
		createꓽfilesystem,
		(g: Graph, path: PathⳇRelative) => insertꓽfile(g, path, undefined),
		upsertꓽfolder,
	)

	return graph
}

function createⵧroot(): FileSystemRoot<FilePayload, FolderPayload> {
	return {
		...createⵧsub(),
		parent: null,
		options: { SEP: "/" },
	}
}

/////////////////////////////////////////////////

export { type FilePayload, type FolderPayload, createⵧsub, createⵧroot }
