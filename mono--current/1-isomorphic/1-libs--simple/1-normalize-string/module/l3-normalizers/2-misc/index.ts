import { combineꓽnormalizers, default_to } from "../../l2-core/normalize.ts"
import {
	coerce_blanks_to_single_spaces,
	coerce_delimiters_to_space,
	coerce_toꓽascii,
	convert_spaces_to_camel_case,
	convert_spaces_to_kebab_case,
	ensure_string,
	to_lower_case,
	to_upper_case,
	trim,
} from "../1-base/index.ts"

/////////////////////////////////////////////////

const coerce_toꓽtokens = combineꓽnormalizers(
	coerce_toꓽascii,
	to_lower_case,
	coerce_delimiters_to_space,
	trim,
	coerce_blanks_to_single_spaces,
)

const coerce_toꓽredeemable_code = combineꓽnormalizers(coerce_toꓽtokens, convert_spaces_to_camel_case, to_upper_case)

const LANGⵧDEFAULT = "en"
const normalizeꓽIETFLanguageType = combineꓽnormalizers(
	ensure_string,
	coerce_toꓽascii,
	to_lower_case,
	coerce_delimiters_to_space,
	trim,
	convert_spaces_to_kebab_case,
	default_to(LANGⵧDEFAULT),
	// that's all we can do, it's complicated https://en.wikipedia.org/wiki/IETF_language_tag
)

/////////////////////////////////////////////////

export { coerce_toꓽtokens, coerce_toꓽredeemable_code, LANGⵧDEFAULT, normalizeꓽIETFLanguageType }
