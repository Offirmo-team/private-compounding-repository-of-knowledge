import * as fs from "node:fs"
import * as path from "node:path"
import * as process from "node:process"

import { type PureModuleDetails } from "@infinite-monorepo/package-details"
import { getꓽpackage_details } from "@infinite-monorepo/pkg-analyzer"
import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"

import { present } from "@monorepo-private/pure-module--presenter"
import { ೱwriteꓽfile } from "@monorepo-private/read-write-any-structured-file/write"

import { GIT_ROOT, MONOREPO_ROOT, MONOREPO__SHARED_TS_TYPINGS‿abs } from "../src/consts.ts"
import { getꓽall_known_pure_module__dirs‿abspath } from "../src/selectors.ts"

console.log(`\n~~~~~~~~~~~~~~~~\nHello!!!`)

/////////////////////////////////////////////////

async function refreshꓽmonorepo() {
	console.log(`🛠 🗂 Refreshing Offirmo’s monorepo "${MONOREPO_ROOT}"…`)

	const pkg_infos_resolver = new PkgInfosResolver()

	const PURE_MODULE__DETAILS = await ↆgetꓽall_pure_module_details(pkg_infos_resolver)

	for (const pkg_details of Object.values(PURE_MODULE__DETAILS)) {
		await present({
			indent: "   ",

			pure_module_path: pkg_details.root‿abspath,
			pkg_details,

			git_root: GIT_ROOT,
			bolt_root: MONOREPO_ROOT,

			dest_dir: path.dirname(pkg_details.root‿abspath),

			ts__custom_types__path: MONOREPO__SHARED_TS_TYPINGS‿abs,

			pkg_infos_resolver,
		})
	}

	// pnpm config
	const catalog = pkg_infos_resolver.get_catalog()
	console.log(catalog)
	ೱwriteꓽfile(path.resolve(MONOREPO_ROOT, "pnpm-workspace.yaml"), {
		catalog: catalog["default"],
	})

	// _aliases--projects.sh
	const aliases: string[] = []
	const radix_set = new Set<string>()
	let last_workspace = ""
	for (const pkg_details of Object.values(PURE_MODULE__DETAILS)) {
		const dest_dir = path.dirname(pkg_details.root‿abspath)
		const relpath = path.relative(MONOREPO_ROOT, dest_dir)
		const relpath_split = relpath.split(path.sep).filter((s) => !!s)
		const tmp = relpath_split
			.map((segment) => {
				if ("0123456789".includes(segment[0])) return segment

				if (segment.startsWith("@")) {
					return [
						"@",
						...segment
							.slice(1)
							.split("-")
							.filter((s) => !!s)
							.map((s) => s[0]),
					]
				}

				return segment.split("--")
			})
			.flat()
		let radix = tmp.map((s) => s[0]).join("")
		let dedupe: number = 1
		while (radix_set.has(radix + (dedupe > 1 ? String(dedupe) : ""))) {
			dedupe++
		}
		radix = radix + (dedupe > 1 ? String(dedupe) : "")
		radix_set.add(radix)
		const workspace = relpath_split[0]
		const subfolder = relpath_split.slice(1).join(path.sep)
		if (workspace !== last_workspace) {
			last_workspace = workspace
			aliases.push("") // separator for readability
		}
		const alias = [
			"alias",
			`mono${radix}='cd`.padStart(15),
			`"$OFFIRMO_MONOREPO_ROOT__CURRENT";`,
			"mise install;",
			"git--offirmo.sh;",
			(`cd ${workspace}/;`.padEnd(24) + `cd ${subfolder}/;`).padEnd(24 + 65),
			`tabset --badge mono${radix}'`, //  --color "#006EDB" https://github.com/jonathaneunice/iterm2-tab-set
		].join(" ")
		aliases.push(alias)
	}
	fs.writeFileSync(
		path.resolve(MONOREPO_ROOT, ".monorepo", "bin", "aliases.sh"),
		`#@IgnoreInspection BashAddShebang
[[ "$VERBOSE__RC" == true ]] && echo "$(date +%H:%M:%S)   ↳ […monorepo/…/aliases.sh] hello!"

export OFFIRMO_MONOREPO_ROOT__CURRENT=\${OFFIRMO_MONOREPO_ROOT__CURRENT:-"$HOME/${path.relative(process.env["HOME"]!, MONOREPO_ROOT)}/"};

${aliases.join("\n")}
`,
		{ encoding: "utf-8" },
	)
}

/////////////////////////////////////////////////

async function resurrectꓽfrom(rootpkg_name) {
	console.log(`🛠 🗂 Resurrecting Offirmo’s monorepo "${MONOREPO_ROOT}" from package "${rootpkg_name}"…`)

	const pkg_infos_resolver = new PkgInfosResolver()

	const PURE_MODULE__DETAILS = await ↆgetꓽall_pure_module_details(pkg_infos_resolver)

	// TODO graph from root
	// TODO check dep loops
	// TODO check tiers
	// TODO compute graph degrees
	// TODO a published module must not depend on an unpublished one
}

/////////////////////////////////////////////////

refreshꓽmonorepo()
//resurrectꓽfrom('@tbrpg/sandbox')

/////////////////////////////////////////////////

async function ↆgetꓽall_pure_module_details(
	pkg_infos_resolver: PkgInfosResolver,
): Promise<Record<string, PureModuleDetails>> {
	const all_known_pure_module__dirs‿abspath = getꓽall_known_pure_module__dirs‿abspath()
	console.log(all_known_pure_module__dirs‿abspath)

	return await all_known_pure_module__dirs‿abspath.reduce(
		async (ೱacc, pure_module_abspath) => {
			const acc = await ೱacc
			const pkg_details = await getꓽpackage_details(pure_module_abspath, {
				indent: "   ",
				pkg_infos_resolver,
			})
			console.log(pkg_details)
			acc[pkg_details.fqname] = pkg_details
			pkg_infos_resolver.inject(
				{
					name: pkg_details.fqname,
					version: pkg_details.version || "0.0.1",
					types: pkg_details.languages.has("ts") ? "[xxx present hack]" : undefined,
				},
				{ force: true },
			)
			return acc
		},
		Promise.resolve({} as Record<string, PureModuleDetails>),
	)
}
