/////////////////////////////////////////////////

// parse-imports-ts keeps bundler queries as part of the package name,
// ex. Vite's `import url from "pkg?url"` yields "pkg?url" (a deep "pkg/file.css?url" is fine, the subpath gets dropped)
export function parseꓽimported_packages(content: string): ImportedPackage[] {
	const imports‿by_name = Map.groupBy(parseImports(content), ({ name }) => removeꓽquery(name))

	return Array.from(imports‿by_name, ([name, imports]) => ({
		name,
		// same rule as parse-imports-ts' internal dedupe, needed again since "pkg?url" and "pkg" were distinct entries
		type: imports.some(({ type }) => type === ImportedPackageType.NormalImport)
			? ImportedPackageType.NormalImport
			: ImportedPackageType.TypeImport,
	}))
}

function removeꓽquery(specifier: string): string {
	return specifier.replace(/\?.*$/, "")
}

/////////////////////////////////////////////////

import { type ImportedPackage, ImportedPackageType, parse as parseImports } from "parse-imports-ts"
