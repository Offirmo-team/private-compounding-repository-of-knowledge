import { assert_from, assert } from "@monorepo-private/assert"
import type { PathⳇRelative } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

function createꓽgraph<Graph = any>(
	create: () => Graph,
	insertꓽfile: (graph: Graph, path: PathⳇRelative) => PathⳇRelative,
	upsertꓽfolder: (graph: Graph, path: PathⳇRelative) => PathⳇRelative,
): { graph: Graph; files: PathⳇRelative[] } {
	let files: PathⳇRelative[] = []
	let _insertꓽfile = insertꓽfile
	insertꓽfile = (graph, path) => {
		const normalized_path = _insertꓽfile(graph, path)
		files.push(normalized_path)
		return normalized_path
	}

	const graph = (() => {
		const graph = create()

		insertꓽfile(graph, "foo/bar/baz.xyz")
		insertꓽfile(graph, "foo/gloups.xyz")
		upsertꓽfolder(graph, "foo/bar/gnokman/")

		return graph
	})()

	return {
		graph,
		files,
	}
}

/////////////////////////////////////////////////

export { createꓽgraph }
