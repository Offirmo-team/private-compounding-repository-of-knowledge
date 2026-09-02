import memoize_once from "memoize-one"

/////////////////////////////////////////////////

function _getꓽmedia_queriesⵧrelevant() {
	// beware of multiplicity!
	// https://www.stucox.com/blog/the-good-and-bad-of-level-4-media-queries/#multiplicity

	const result: Record<string, boolean> = {}

	// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
	;[
		// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover
		"(any-hover: none)",
		"(any-hover: hover)",
		// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
		"(any-pointer: none)",
		//'(any-pointer: coarse)',
		"(any-pointer: fine)",
		// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
		//'(orientation: portrait)',
		//'(orientation: landscape)',
	].forEach((mq) => {
		result[mq] = window.matchMedia(mq).matches
	})

	return result
}

const getꓽmedia_queriesⵧrelevant = memoize_once(_getꓽmedia_queriesⵧrelevant)

/////////////////////////////////////////////////

export { getꓽmedia_queriesⵧrelevant }
