/////////////////////////////////////////////////

export function getꓽnamespace(pkg_name: PkgFQName): PkgNamespace | null {
	const ǃ = assert_from({ getꓽnamespace })

	if (pkg_name.includes("/")) {
		ǃ.forⵧparam({ pkg_name }).require(pkg_name.startsWith("@"), `A pkg namespace should start with @`)
		const [scope, _] = pkg_name.split("/")
		return scope as PkgNamespace
	}

	return null
}

export function isꓽnpm_package(moduleName: string): boolean {
	if (moduleName.startsWith("node:")) {
		return false
	}

	return true
}

export function isꓽtypes_pkg(pkg_name: PkgFQName): boolean {
	return pkg_name.startsWith("@types/")
}

export function getꓽlikely_corresponding_types_pkg(pkg_name: PkgFQName): PkgFQName {
	if (isꓽtypes_pkg(pkg_name)) throw new Error(`Already a @types/ package!`)

	// https://github.com/DefinitelyTyped/DefinitelyTyped?tab=readme-ov-file#npm
	if (pkg_name.includes("/")) {
		const [scope, name] = pkg_name.split("/")
		return `@types/${scope!.slice(1)}__${name}`
	}

	return `@types/${pkg_name}`
}

export function hasꓽembedded_typescript_types(packageᐧjson: PackageJson): boolean {
	if (packageᐧjson.types) return true

	// non standard
	const raw = packageᐧjson as any
	if (
		raw.typings ||
		raw?.exports?.types || // https://github.com/sindresorhus/write-json-file/blob/main/package.json
		raw.files?.includes("index.d.ts") || // https://github.com/sindresorhus/load-json-file/blob/main/package.json
		["load-json-file"].includes(raw.name) // TODO review
	)
		return true

	if (packageᐧjson.name === "type-fest") {
		// TODO why is it misdetected?
		return true
	}

	// warning @types/strip-bom@4.0.1: This is a stub types definition. strip-bom provides its own type definitions, so you do not need this installed.
	if (packageᐧjson.name === "strip-bom") {
		// types are not declared in package.json, they just have a sibling .d.ts, can't guess from the package.json only
		return true
	}

	// freshly release TS 7 trip the detection
	if (packageᐧjson.name === "typescript") {
		// TODO why is it misdetected?
		return true
	}

	return false
}

/////////////////////////////////////////////////

import { assert_from } from "@monorepo-private/assert"

import type { PkgFQName, PackageJson, PkgNamespace } from "./types.ts"
