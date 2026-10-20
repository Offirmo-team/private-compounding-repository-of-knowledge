/* PROMPT
 */

import { combineꓽnormalizers } from "../../l2-core/normalize.ts"
import {
	coerce_blanks_to_single_spaces,
	coerce_delimiters_to_space,
	coerce_toꓽascii,
	convert_spaces_to_kebab_case,
	to_lower_case,
	trim,
} from "../1-base/index.ts"

/////////////////////////////////////////////////

// for files safe from unicode, spaces & case sensitivity
const coerce_toꓽsafe_basenameⵧstrictest = combineꓽnormalizers(
	coerce_toꓽascii,
	to_lower_case,
	coerce_delimiters_to_space,
	trim,
	coerce_blanks_to_single_spaces,
	convert_spaces_to_kebab_case,
)

// normalize so that
// - trailing and leading slashes are consistent
// - allow easy "split" by keeping only the middle slashes
// - thrown on common mistakes
function normalizeꓽpath(path: string, type?: "file" | "folder", SEP = "/"): string {
	path = path.trim() // technically spaces could be significant but who would ever do that?

	if (path.startsWith(SEP)) path = path.slice(SEP.length)

	if (path.endsWith(SEP)) {
		if (type === "file") {
			// very likely a file/folder mismatch, report it!
			throw new Error(`file path should not end with a separator! "${path}"`)
		}
		path = path.slice(0, -SEP.length)
	}

	const path‿split = path.split(SEP)
	if (path‿split.some((p) => p != p.trim())) {
		// technically possible but who would ever do that??
		throw new Error(`all segments should be trimmed! "${path}"`)
	}

	if (path‿split.some((p) => !p) && path !== "") {
		// empty path = root is a special case
		throw new Error(`path should not have a hole! "${path}"`)
	}

	if (path‿split.some((p) => p === "." || p === "..")) {
		// we could implement it but not worth the hassle for now
		throw new Error(`path should not contain . or ..! "${path}"`)
	}

	return path
}

/////////////////////////////////////////////////

export { coerce_toꓽsafe_basenameⵧstrictest, normalizeꓽpath }
