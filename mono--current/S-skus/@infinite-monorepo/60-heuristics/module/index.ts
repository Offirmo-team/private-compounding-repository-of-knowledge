/////////////////////////////////////////////////

export function isꓽignored_file(entry: FileEntry): boolean {
	if (entry.ext === "") {
		// extensionless files such as .gitignore, .nojekyll, CNAME are usually ignored
		// known:
		// .DS_Store // should never happen bc git-ignored at user level, reported: https://github.com/npm/ignore-walk/issues/146
		// .gitignore // should never happen bc should be git-ignored, reported: https://github.com/npm/ignore-walk/issues/147
		// LICENSE // license override for a sub-folder, ignore
		// .nojekyll very specific GitHub pages arcane, not code, ignore: file https://github.com/blog/572-bypassing-jekyll-on-github-pages
		return true
	}

	if (entry.ext === ".local") {
		// local temp files, e.g. .env.local
		return true
	}

	if (entry.ext === ".bkp") {
		// temp bkp of a file, not canonical
		return true
	}

	if (
		[
			// BINARY assets = leaf nodes (no deps)
			".gif",
			".heic",
			".jpg",
			".mp3",
			".otf",
			".png",
			".ttf",
			".webp",
			".woff",
			// do NOT add .svg, this is source code with deps!
		].includes(entry.ext)
	) {
		return true
	}

	if (entry.ext === ".svg") {
		// technically an SVG can
		// - reference resources
		// - embed HTML itself referencing other resources
		// TODO 1D find a way to detect deps (use parcel?)
		return true
	}

	if (entry.ext === ".md") {
		// technically a Markdown file can reference resources
		// ex. static website
		// TODO 1D find a way to detect deps (use parcel?)
		return true
	}

	if (entry.ext === ".json" || entry.ext === ".jsonc" || entry.ext === ".json5") {
		// technically some JSON files can reference resources
		// ex. website manifest
		// TODO 1D improve
		return true
	}

	if (entry.ext === ".txt") {
		// not recommended vs. better formats such as .md
		// but happens, ex. "well-known" files
		return true
	}

	return false
}

export function isꓽin_ignored_folder(entry: FileEntry): boolean {
	const { path‿rel } = entry

	if (path‿rel.includes("node_modules/")) {
		// should never happen if our gitignore works
		throw new Error(`A pure module should not contain node_modules!`)
	}

	if (path‿rel.includes("~~tosort")) return true

	// vendored deps are supposed to have no deps
	if (path‿rel.includes("__vendored/")) return true

	return false
}

export function isꓽin_unstructured_folder(entry: FileEntry): boolean {
	const { path‿rel } = entry

	if (path‿rel.includes("~~"))
		// means unstructured
		return true

	return false
}

export function inferꓽdeptype_from_caller(entry: FileEntry): DependencyType {
	let { path‿rel, extⵧsub } = entry
	path‿rel = "/" + path‿rel

	if (path‿rel.includes("/__"))
		// temp / technical
		return "dev"

	if (path‿rel.includes("/##"))
		// doc
		return "dev"

	if (path‿rel.includes("/++"))
		// generators
		return "dev"

	if (extⵧsub === ".tests") return "dev"
	if (extⵧsub === ".evals") return "dev"
	if (extⵧsub === ".stories") return "dev"
	if (extⵧsub === ".typecheck") return "dev"

	return "normal"
}

/////////////////////////////////////////////////

import type { DependencyType } from "@infinite-monorepo/primitives"

import type { FileEntry } from "@monorepo-private/file-entry"
