import type { StringNormalizer } from "../../l1-types/types.ts"

/////////////////////////////////////////////////

// nullish => empty string
// other => String()'ed
function ensure_string(s: any): string {
	return String(s ?? "")
}

/////////////////////////////////////////////////

// TODO should use normalization .normalize("NFKC") = convert mathematical bold and italic back to ascii?
// https://web.archive.org/web/20220905234027/https://thread.engineering/searching-and-sorting-text-with-diacritical-marks-in-javascript/
const coerce_toꓽascii: StringNormalizer = (s) =>
	s
		.normalize("NFD") // D = Decompose = split some chars into base + diacritics (doesn't work for all chars)
		.replace(/[\u0300-\u036f]/g, "") // remove the diacritics = keep the base char, ex. é -> e
		.replace(/ß/g, "ss") // replace some common chars not handled by NFD
		.replace(/’/g, "'")
		// TODO 1D cleanly remove emojis (which sometimes are converted to ???)
		.replace(/[^\x00-\x7F]/g, "?") // finally, wipes any remaining non-ascii char

// https://devdocs.io/javascript/global_objects/string/normalize
// https://withblue.ink/2019/03/11/why-you-need-to-normalize-unicode-strings.html
const RECOMMENDED_UNICODE_NORMALIZATION = "NFC" // https://www.win.tue.nl/~aeb/linux/uc/nfc_vs_nfd.html
const normalize_unicode: StringNormalizer = (s) => {
	s = s.normalize(RECOMMENDED_UNICODE_NORMALIZATION)
	if ((s as any).toWellFormed) s = (s as any).toWellFormed() // https://devdocs.io/javascript/global_objects/string/towellformed
	return s
}

/////////////////////////////////////////////////
// Case
const to_lower_case: StringNormalizer = (s) => s.toLowerCase()
const to_upper_case: StringNormalizer = (s) => s.toUpperCase()

// simplest = capitalize the 1st letter
const capitalizeⵧfirst: StringNormalizer = (s) => to_upper_case(s[0] ?? "") + s.slice(1)
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize#value
const capitalizeⵧwords: StringNormalizer = (s) =>
	s
		.split(" ")
		.map((s) => capitalizeⵧfirst(s))
		.join(" ")
// a / an / -
const capitalizeⵧwordsⵧadvanced: StringNormalizer = (s) =>
	s
		.split(" ")
		.map((s) =>
			s
				.split("-")
				.map((s) => capitalizeⵧfirst(s))
				.join("-"),
		)
		.map((s) => capitalizeⵧfirst(s))
		.join(" ")

// lodash style 1st letter + force rest lowercase https://devdocs.io/lodash~4/index#capitalize
// = NO! trivial for the caller to do "to_lower_case" before calling a capitalizer

// TODO more on demand https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize#value
// const capitalizeⵧwordsⵧnon_trivial: StringNormalizer = (no the / a / an etc.)

/////////////////////////////////////////////////

// https://devdocs.io/javascript/global_objects/string/trim
const trim: StringNormalizer = (s) => s.trim()

/////////////////////////////////////////////////

// https://stackoverflow.com/a/1981366/587407
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes#types
const ANY_BLANK_REGEXP = /\s+/g
const coerce_blanks_to_single_spaces: StringNormalizer = (s) => s.replace(ANY_BLANK_REGEXP, " ")

// useful to fix autocomplete after typing "."
function remove_all_spaces(s: string): string {
	return s.split(" ").join("")
}

// https://stackoverflow.com/a/19313707/587407
const ANY_DELIMITER_REGEXP = new RegExp("[-+()*/:? _\.ⵧ]", "g")
const coerce_delimiters_to_space: StringNormalizer = (s) => s.replace(ANY_DELIMITER_REGEXP, " ")

// common way to encode spaces
const coerce_underscores_to_space: StringNormalizer = (s) => s.replaceAll("_", " ")

const convert_spaces_to_camel_case: StringNormalizer = (s) =>
	s
		.split(" ")
		.filter((s) => !!s)
		.map(capitalizeⵧfirst)
		.join("")

const convert_spaces_to_kebab_case: StringNormalizer = (s) =>
	s
		.split(" ")
		.filter((s) => !!s)
		.join("-")

/////////////////////////////////////////////////

export {
	ensure_string,
	coerce_toꓽascii,
	RECOMMENDED_UNICODE_NORMALIZATION,
	normalize_unicode,
	capitalizeⵧfirst,
	capitalizeⵧwords,
	capitalizeⵧwordsⵧadvanced,
	to_lower_case,
	to_upper_case,
	trim,
	coerce_blanks_to_single_spaces,
	remove_all_spaces,
	coerce_delimiters_to_space,
	coerce_underscores_to_space,
	convert_spaces_to_camel_case,
	convert_spaces_to_kebab_case,
}
