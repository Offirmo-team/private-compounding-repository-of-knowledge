//import { EOL } from 'node:os' we need to be runtime agnostic, ex. lambda or workers
import getꓽterminal_size from "terminal-size"

import type { DisplayOptions } from "./types.ts"

/////////////////////////////////////////////////

const OPTIONS__DISPLAYⵧDEFAULT: DisplayOptions = {
	eol: "\n", //EOL as DisplayOptions['eol'],
	max_width‿charcount: getꓽterminal_size().columns,
	indent_size‿charcount: 3,
	max_primitive_str_size: null,
	should_recognize_constants: true,
	should_recognize_globals: true,
	should_sort_keys: false,
	should_compact_objects: true,
	should_warn_not_json: false,
	quote: "'",
	date_serialization_fn: "toLocaleString",
}

/////////////////////////////////////////////////

export { OPTIONS__DISPLAYⵧDEFAULT }
