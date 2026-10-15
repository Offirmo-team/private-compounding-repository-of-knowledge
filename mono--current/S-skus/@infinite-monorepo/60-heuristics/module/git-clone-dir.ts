/////////////////////////////////////////////////
// Port of the folder layout decided by the "gitc" clone script
// https://github.com/Offirmo/open-source-dev-env/blob/main/2-shell/bin/gitc.sh
// MUST stay in sync with it

export type GitOwnerCategory = "work" | "personal" | "offirmo" | "external"

export interface GitOwnersByCategory {
	ownersⵧoffirmo: ReadonlyArray<string>
	ownersⵧwork: ReadonlyArray<string> // gitc: $COMPANY_USERNAME__GITHUB $COMPANY_ORG1__GITHUB $COMPANY_ORG2__GITHUB
	ownersⵧpersonal: ReadonlyArray<string> // gitc: $PERSONAL_USERNAME__GITHUB
}

export interface GitCloneDirParams extends Partial<GitOwnersByCategory> {
	url: string
	dir_nameⵧcustom?: string | undefined
	// NOT expanded: may contain shell variables, to be used in generated shell scripts
	dirⵧroot?: string
	subdir_by_category?: Partial<Record<GitOwnerCategory, string>>
}

export interface GitRemoteCoordinates {
	owner: string // user or org, case preserved
	repo_name: string
}

export const GIT_CLONE_DIR__DEFAULTS = {
	dirⵧroot: "$HOME/work/src",
	ownersⵧoffirmo: ["offirmo", "online-adventures", "offirmo-team", "offirmo-graveyard"],
	ownersⵧwork: [],
	ownersⵧpersonal: [],
	subdir_by_category: {
		work: "", // work gets top level
		personal: "private",
		external: "x-external",
		offirmo: "x-external/off", // Offirmo has several orgs, group them
	},
} as const satisfies Required<Omit<GitCloneDirParams, "url" | "dir_nameⵧcustom">>

/////////////////////////////////////////////////

export function deriveꓽgit_clone_dir(params: Readonly<GitCloneDirParams>): string {
	const { owner, repo_name } = parseꓽgit_remote_url(params.url)
	const ownerⵧnormalized = owner.toLowerCase()

	const category = inferꓽgit_owner_category(ownerⵧnormalized, {
		ownersⵧoffirmo: params.ownersⵧoffirmo ?? GIT_CLONE_DIR__DEFAULTS.ownersⵧoffirmo,
		ownersⵧwork: params.ownersⵧwork ?? GIT_CLONE_DIR__DEFAULTS.ownersⵧwork,
		ownersⵧpersonal: params.ownersⵧpersonal ?? GIT_CLONE_DIR__DEFAULTS.ownersⵧpersonal,
	})
	const subdir = params.subdir_by_category?.[category] ?? GIT_CLONE_DIR__DEFAULTS.subdir_by_category[category]

	return path.posix.join(
		params.dirⵧroot ?? GIT_CLONE_DIR__DEFAULTS.dirⵧroot,
		subdir,
		ownerⵧnormalized,
		params.dir_nameⵧcustom || repo_name,
	)
}

// works for both https://host/owner/repo.git and git@host:owner/repo.git
export function parseꓽgit_remote_url(url: string): GitRemoteCoordinates {
	const [owner, repo_segment] = url
		.trim()
		.split(/[/:]/)
		.filter((segment) => segment !== "")
		.slice(-2)
	const repo_name = repo_segment?.replace(/\.git$/, "")
	assert(!!owner && !!repo_name, `Unrecognized git remote URL "${url}"!`)

	return { owner, repo_name }
}

// precedence matches gitc: offirmo > work > personal
export function inferꓽgit_owner_category(owner: string, owners: Readonly<GitOwnersByCategory>): GitOwnerCategory {
	const ownerⵧnormalized = owner.toLowerCase()
	const isꓽamong = (candidates: ReadonlyArray<string>) =>
		candidates.some((candidate) => candidate.toLowerCase() === ownerⵧnormalized)

	if (isꓽamong(owners.ownersⵧoffirmo)) return "offirmo"
	if (isꓽamong(owners.ownersⵧwork)) return "work"
	if (isꓽamong(owners.ownersⵧpersonal)) return "personal"
	return "external"
}

/////////////////////////////////////////////////

import * as path from "node:path"

import { assert } from "@monorepo-private/assert"
