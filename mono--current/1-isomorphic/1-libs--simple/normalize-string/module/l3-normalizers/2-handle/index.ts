// for user names, player names...

import { combineꓽnormalizers } from "../../l2-core/normalize.ts"
import {
	coerce_blanks_to_single_spaces,
	coerce_delimiters_to_space,
	coerce_toꓽascii,
	convert_spaces_to_camel_case,
	to_lower_case,
	trim,
} from "../1-base/index.ts"

/////////////////////////////////////////////////

// TODO extra rules https://9to5mac.com/2025/06/02/whatsapp-getting-usernames/

const coerce_toꓽnicknameⵧsafe = combineꓽnormalizers(
	coerce_toꓽascii, // no unicode allowed
	to_lower_case,
	coerce_delimiters_to_space,
	trim,
	coerce_blanks_to_single_spaces,
	convert_spaces_to_camel_case,
)

/////////////////////////////////////////////////

export { coerce_toꓽnicknameⵧsafe }
