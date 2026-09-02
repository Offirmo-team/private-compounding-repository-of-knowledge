import type { VersionSpecification } from "./01-primitives.ts"

/////////////////////////////////////////////////

export type JsRuntimeKey =
	// TODOOO should be plugin??
	| "minimum-common-api" // https://github.com/WinterTC55/proposal-minimum-common-api https://blog.cloudflare.com/introducing-the-wintercg/
	| "node" // https://nodejs.org/
	| "deno" // https://deno.com/
	| "bun" // https://bun.com/
	| "browserⵧdocument"
	| "browserⵧworker"
	// aliases
	| "aws-lambda" // node-backed?
	| "cloudflare-worker" // ~minimum commmon api?
	// …contributions welcome!
	| (string & {})

export type LocalJsRuntimeKey = Extract<JsRuntimeKey, "node" | "deno" | "bun">

export interface JsRuntimeSpec<_JsRuntimeKey = JsRuntimeKey> extends VersionSpecification {
	name: _JsRuntimeKey
}

/////////////////////////////////////////////////

export const PKG_MANAGERS = [
	"bolt", // https://github.com/boltpkg/bolt
	"bun", // https://bun.com/docs/install/workspaces
	"deno",
	"npm",
	"pnpm", // https://pnpm.io/
	"yarn--v1",
	"yarnⵧberry", // https://yarnpkg.com/
] as const
export type PackageManagerKey = (typeof PKG_MANAGERS)[number] | (string & {})

export interface PackageManagerSpec extends VersionSpecification {
	name: PackageManagerKey
}

/////////////////////////////////////////////////
