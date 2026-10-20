/////////////////////////////////////////////////

// nullish => empty string
// other => String()'ed
function ensure_string(s: any): string {
	return String(s ?? "")
}

/////////////////////////////////////////////////

// Lossy by design: best effort to keep the text readable once restricted to ascii.
// The steps are ORDER-DEPENDENT: each one relies on the previous ones.
// https://web.archive.org/web/20220905234027/https://thread.engineering/searching-and-sorting-text-with-diacritical-marks-in-javascript/
// Should we also trim? No, trim is common and a different concern. Just be sure to trim after coercion.
const coerce_toꓽascii: StringNormalizer = (s) =>
	s
		// NFKD because:
		// - K = Compatibility: fold presentation variants into their plain equivalent, ex. 𝗳 → f, Ｆ → F, ﬁ → fi, ² → 2, ™ → TM, … → ...
		// - D = Decompose: split accented chars into base + combining marks, ex. é → e + ◌́
		// NOT NFKC: C = re-Compose would merge the marks back into é and the next step would have no easy way to remove variations
		.normalize("NFKD")
		// remove the combining marks (diacritics…) = keep the base char, ex. é → e
		// also removes some emoji parts which are marks: the variation selector in ❤️ and the keycap in 1️⃣
		.replace(/\p{Mark}/gu, "")
		// symbols not handled by NFKD, MUST happen before emoji removal since they are emojis
		.replace(/©/g, "(c)")
		.replace(/®/g, "(r)")
		// by choice, remove emojis entirely, along with the invisible code points gluing them together
		.replace(/\p{Extended_Pictographic}/gu, "") // the pictures themselves, ex. 🐯 💻
		.replace(/\p{Emoji_Modifier}/gu, "") // skin tones, ex. 🏽
		.replace(/\p{Regional_Indicator}/gu, "") // flags are pairs of those, ex. 🇫🇷
		.replace(/\u200D/g, "") // Zero Width Joiner, combines emojis, ex. 👩‍💻 = 👩 + ZWJ + 💻
		// some common chars not handled by NFKD
		.replace(/ß/g, "ss")
		.replace(/’/g, "'")
		// finally, replace any remaining leftover non-ascii char
		// the u flag is needed to match whole code points, otherwise a char outside the BMP (ex. 🐯) would become "??"
		.replace(/[^\p{ASCII}]/gu, "?")

// https://withblue.ink/2019/03/11/why-you-need-to-normalize-unicode-strings.html
// Note: some sources advocates NFD. Keeping NFC for now 2026/10  https://www.win.tue.nl/~aeb/linux/uc/nfc_vs_nfd.html
const RECOMMENDED_UNICODE_NORMALIZATION = "NFC"
const normalize_unicode: StringNormalizer = (s) => {
	// https://devdocs.io/javascript/global_objects/string/normalize
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
const ANY_DELIMITER_REGEXP = new RegExp("[-+()*/:? _.ⵧ]", "g")
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

import type { StringNormalizer } from "../../l1-types/types.ts"
