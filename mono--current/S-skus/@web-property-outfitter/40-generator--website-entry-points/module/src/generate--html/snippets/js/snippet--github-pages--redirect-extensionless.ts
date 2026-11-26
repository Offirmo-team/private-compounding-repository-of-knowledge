/////////////////////////////////////////////////
// This is for servers who don't support extensionless URLs
// e.g. GitHub Pages

/////////////////////////////////////////////////
/////// REMINDER THIS IS A SNIPPET ///////
// the function should be self-contained (no imports, no references)

/// <reference lib="dom" />
declare global {
	interface Location {
		_isꓽredirect_pending?: true // to communicate to possible other redirects that one is already in progress. Either doesn't exist or true, cleared naturally on reload
	}
}

export default function redirect_extensionless_known_pathes() {
	if (location._isꓽredirect_pending) return

	const pathnameⵧwithout_leading_and_trailing_slash = location.pathname
		.split("/")
		.filter((s) => !!s)
		.join("/")

	const trailing_path_segment = pathnameⵧwithout_leading_and_trailing_slash.split("/").at(-1) || ""
	if (!trailing_path_segment) {
		// ✔ we're at the root of the domain
		return
	}

	const has_trailing_segment_an_extension = trailing_path_segment.split(".").length > 1
	if (has_trailing_segment_an_extension) {
		// ✔ the trailing segment has an extension
		return
	}

	// ✖ we are located by an extension-less path
	// Our server doesn't support extensionless URLs
	// attempt to redirect to the version with an extension (this may still 404)
	const locationᐧpathnameⵧfixed = "/" + pathnameⵧwithout_leading_and_trailing_slash + ".html"

	console.log("redirect_extensionless_known_pathes() REDIRECTING…")
	location._isꓽredirect_pending = true
	location.replace(location.origin + locationᐧpathnameⵧfixed + location.search + location.hash)
}

import type { Url‿str } from "@monorepo-private/ts--types"
