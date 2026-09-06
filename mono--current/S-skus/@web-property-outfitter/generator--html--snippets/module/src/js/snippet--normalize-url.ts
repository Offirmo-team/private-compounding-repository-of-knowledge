// how to redirect: https://love2dev.com/blog/ways-to-use-javascript-redirect-to-another-page/
// +be careful to not lose any part of the URL: origin + pathname + search + hash
// can also be automatically handled by the provider https://developers.cloudflare.com/workers/wrangler/configuration/#assets

export default function normalize_trailing_slash() {
	/* IF the current path doesn't end with a trailing slash, this may be an issue
	 * ex if we're located by our parent folder (implicit file, a lot of servers automatically do that)
	 *    foo/bar/index.html   served as  /foo/bar (no trailing slash)
	 * It messes with relative paths!
	 * ex. (continued) link rel=site.webmanifest = /foo/site.webmanifest
	 * https://searchfacts.com/url-trailing-slash/
	 * https://ahrefs.com/blog/trailing-slash/
	 *
	 * Could we use <base> instead? Pb. is when the content is served on different domains: dev, staging, prod...
	 *
	 * SO we decide to ensure folders have a trailing slash
	 * ex. /foo/bar/index.html => ✔ no change
	 * ex. /foo/bar/           => ✔ no change
	 * ex. /foo/bar            => ✖ REDIRECT foo/bar/
	 */
	const trailing_segment = location.pathname.split("/").at(-1) || ""
	if (!trailing_segment) {
		// ✔ located by a folder, location ends with a trailing slash
		// NOTE Some browsers (Chrome) may VISUALLY HIDE the trailing slash on the root of the domain, but it's there ✔
		return
	}

	const is_trailing_segment_a_html_file = trailing_segment.endsWith(".html") || trailing_segment.endsWith(".htm")
	if (is_trailing_segment_a_html_file) {
		// ✔ located by a file, no trailing slash
		return
	}

	// ✖ we are located by a folder without a trailing slash.
	// Redirect to the version with slash
	const locationᐧpathnameⵧfixed = location.pathname + "/"

	// Do NOT use location.replace() or it can trigger infinite loops with servers doing auto redirects with/without slashes ex. https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
	history.replaceState(null, "", location.origin + locationᐧpathnameⵧfixed + location.search + location.hash)
}
