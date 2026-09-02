/////////////////////////////////////////////////

export function get_parent_package_json(import_meta: ImportMeta): string {
	const pkgPath = findPackageJSON(import_meta) // Node ≥22.13
	const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
	console.log(pkg.name, pkg.version)
}

/////////////////////////////////////////////////

import { readFileSync } from "node:fs"
import { findPackageJSON } from "node:module"
