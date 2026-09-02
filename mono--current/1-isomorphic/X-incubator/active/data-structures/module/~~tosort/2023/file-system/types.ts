import { Graph } from '../generic/index.js'

/////////////////////////////////////////////////

type FSPath = string

interface FileSystem {
	options: {
		separator: string
	}

	graph: Graph
}

/////////////////////////////////////////////////

export {
	type FSPath,
	type FileSystem,
}
