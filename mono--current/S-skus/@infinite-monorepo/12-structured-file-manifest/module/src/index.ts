import type { StructuredFileFormat } from "@monorepo-private/read-write-any-structured-file"
import type { PathⳇRelative, Url‿str } from "@monorepo-private/ts--types"

/////////////////////////////////////////////////

export interface StructuredFsⳇFileManifest {
	path‿ar: PathⳇRelative // TODO fix loop should be AnyRepoFilePathⳇRelative

	// SSoT: only needed if not inferrable from the path/name/extension
	format?: StructuredFileFormat // if needed: TODO improve @monorepo-private/read-write-any-structured-file instead

	// TODO externalize
	// TODO should match the format?
	hints?: {
		comment_prefixⵧsingle_line?: string | null
		sort_siblings?: boolean
		trailing_line?: "ensure-present" | "ensure-absent"
		trim_trailing_spaces?: boolean
	}

	// TODO 1D normalize
	$schema?: `https://www.schemastore.org/${string}.json` | `https://json.schemastore.org/${string}`
	doc: Array<Url‿str>
}

export const DEFAULT_HINTS: NonNullable<StructuredFsⳇFileManifest["hints"]> = {
	comment_prefixⵧsingle_line: null,
	sort_siblings: true,
	trailing_line: "ensure-present",
	trim_trailing_spaces: true,
}

/////////////////////////////////////////////////
