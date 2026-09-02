
/*
// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
function has_any_touch(window = window) {
	const from_MQ = window.matchMedia('(any-hover: hover)')
	const from_
}

// https://www.stucox.com/blog/you-cant-detect-a-touchscreen/
function has_any_pointer(window = window) {
	const from_MQ = window.matchMedia('(any-hover: hover)')
	const from_
}
*/


function get_debug_snapshot() {
	return {
		relevant_media_queries,
		usages: get_usage_observations(),
		has_any_hover: has_any_hover(),
		uses_tab: uses_tab(),
	}
}
