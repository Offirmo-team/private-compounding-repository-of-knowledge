// This is for servers who don't support extensionless URLs
// ex. GitHub Pages

export default function redirect_extensionless_known_pathes() {
	if (location.redirect_pending) return

	const pathname_without_leading_and_trailing_slash = location.pathname
		.split("/")
		.filter((s) => !!s)
		.join("/")

	const trailing_path_segment = pathname_without_leading_and_trailing_slash.split("/").at(-1) || ""
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
	const locationᐧpathnameⵧfixed = "/" + pathname_without_leading_and_trailing_slash + ".html"

	console.log("redirect_extensionless_known_pathes() REDIRECTING…")
	location.redirect_pending = true // to communicate to possible other redirects that one is already in progress
	location.replace(location.origin + locationᐧpathnameⵧfixed + location.search + location.hash)
}
