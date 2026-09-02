/////////////////////////////////////////////////

const packageᐧjson__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/package.json`
export const manifestꓽpackageᐧjson: StructuredFsⳇFileManifest = {
	path‿ar: packageᐧjson__path‿ar,
	doc: [
		"https://docs.npmjs.com/cli/v11/configuring-npm/package-json",
		"https://docs.npmjs.com/about-packages-and-modules",
	],
}

const PURE_MODULE_CONTENT_RELPATH = "module" // for now

// TODO configurable
const NODE__OPTIONS = `--env-file-if-exists=.env.local --experimental-webstorage --localstorage-file=.node-ls.local`
const NODE_INVOCATION = `node ${NODE__OPTIONS}` //  --experimental-strip-types

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽpackageᐧjson)

		return state
	},

	onꓽnodeⵧrefine(state: Immutable<State>, node: Immutable<Node>) {
		if (node?.type !== "monorepo" && node?.type !== "package") return state // only those have package.json

		const pkg_details = node.details
		if (pkg_details._error) {
			return state // not our concern
		}

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		const ǃ = assert_from({ onꓽapply: PLUGIN.onꓽapply! })

		if (node.type !== "monorepo" && node.type !== "package") return state // only those have package.json

		const pkg_details = node.details
		if (pkg_details._error) {
			return state // not our concern
		}

		// debug
		state = StateLib.requestꓽfile_output(state, {
			parent_node: node,
			manifest: {
				path‿ar: `${PATHVARⵧROOTⵧPACKAGE}/.monorepo/details.log`,
				format: "json5",
				doc: [],
			},
			intent: "present--exact",
			content: trim_before_stringify(pkg_details, {
				onꓽnonᝍjson: "convert",
			}),
		} satisfies FileOutputPresent)

		const { pkg_infos_resolver } = state

		// TODO hoist engines to root
		const enginesⵧcleaned = {} /*Object.fromEntries(
			Object.entries(pkg_details.engines).filter(([k, v]) => {
				if (k === "browser") {
					// not a formal engine
					// also Parcel complains about it
					return false
				}

				return true
			}),
		)*/
		if (node.type === "monorepo") {
			const rl = StateLib.getꓽruntimeⵧlocal(state, node)
			enginesⵧcleaned[rl.name] = rl.versionⵧrecommended ?? rl.versionsⵧacceptable
		}

		let pkg: any = {
			"// @infinite-monorepo/plugin--package-json": "auto generated some content in this file",
		}

		/////// common fields (BEWARE OF CONFLICTS)
		pkg = {
			...pkg,
			type: "module", // we're modern, and many tools now rely on this
			name: pkg_details.fqname,
			...(pkg_details.description && { description: pkg_details.description }),
			version: pkg_details.version,
			...(pkg_details.isꓽpublished && { author: pkg_details.author }),
			...(pkg_details.license && { license: pkg_details.license }),
			...(pkg_details.isꓽpublished ? {} : { private: true }),

			sideEffects: pkg_details.hasꓽside_effects ?? pkg_details.isꓽapp ?? false,

			...(Object.keys(enginesⵧcleaned).length && { engines: enginesⵧcleaned }),

			scripts: pkg_details.scripts,
		}

		// dependencies
		PkgDetailsLib.for_eachꓽdependency_type(pkg_details, ({ type, map }) => {
			if (map.size === 0) return

			// TODO 1D improve versioning (multi catalog)
			const pkg_key = type === "normal" ? "dependencies" : `${type}Dependencies`
			const deps_fqname: PkgFQName[] = Array.from(map.keys()).sort()
			pkg[pkg_key] = Object.fromEntries(
				deps_fqname.map((dep) => [dep, pkg_infos_resolver.ǃgetꓽversionⵧfor_dependencies_field(dep)]),
			)
		})

		if (node.type === "monorepo") {
			const rl = StateLib.getꓽruntimeⵧlocal(state, node)
			pkg = mergeⵧdeep(pkg, {
				resolutions: {
					// TODO move somewhere else
					sharp: "^0.34",
				},
				devEngines: {
					// TODO review if useful
					runtime: {
						onFail: "error",
						name: rl.name,
						version: rl.versionsⵧacceptable,
					},
				},
			})
		} else if (node.type === "package") {
			// TODO clarify
			// TODO what if no main?

			Object.keys(pkg_details.entrypointⵧexports)
				.sort()
				.forEach((k) => {
					pkg.exports ||= {}
					pkg.exports[k] =
						"./" + path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧexports[k]!.path‿rel)
				})
			if (pkg_details.entrypointⵧmain) {
				const SRC_RELPATH = path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)
				const SRC_DIR_RELPATH = path.dirname(SRC_RELPATH)

				// exports
				pkg.exports = {
					...pkg.exports,
					".": "./" + SRC_RELPATH, // TODO should be auto if main
				}
			}

			//pkg.source = SRC_RELPATH NO MORE source, non standard, superseded by exports

			pkg.scripts = (() => {
				const scripts: Record<string, string> = {
					...pkg.scripts,
				}

				/////// order is important

				/////// Clean
				const monorepo_clean_targets = new Set<string>()
				if (pkg_details.isꓽpublished) {
					monorepo_clean_targets.add("…dist")
				}
				if (pkg_details.target === "browser") {
					monorepo_clean_targets.add("…cache") // for Parcel
					monorepo_clean_targets.add("…dist") // as well, parcel outputs stuff in a dist dir when serving locally
				}
				if (monorepo_clean_targets.size) {
					scripts["_clean--pkg"] = `monorepo-script--clean-package ${Array.from(monorepo_clean_targets).join(" ")}`
				}

				const scriptsⵧclean = Object.keys(scripts).filter((k) => k.startsWith("clean") || k.startsWith("_clean"))
				if (scriptsⵧclean.length) {
					scripts["clean"] = `npm-run-all ${scriptsⵧclean.join(" ")}`
				}

				/////// Dev
				if (pkg_details.hasꓽtestsⵧunit) {
					scripts["test"] =
						// TODO one day discriminate between test types? --unit
						// todo refine to module/src if any or skip ~~
						//`${NODE_INVOCATION} ./node_modules/.bin/mocha -- --bail --config ./node_modules/@monorepo-private/toolbox--unit-tests/module/mocharc.json ./node_modules/@monorepo-private/toolbox--unit-tests/module/mocha-chai-init-node.mjs './${PURE_MODULE_CONTENT_RELPATH}/**/*.tests.ts'`
						[
							//`${NODE_INVOCATION} ./node_modules/.bin/mocha --`, <-- NO pnpm wraps bin in some shell script so we can't invoke it with node
							`${NODE_INVOCATION} ./node_modules/mocha/bin/mocha.js --`, // WARN internal, may break
							"--bail",
							"--config ./node_modules/@monorepo-private/config--mocha/module/mocharc.json",
							"./node_modules/@monorepo-private/config--mocha/module/mocha-chai-init-node.mjs",
							`'./${PURE_MODULE_CONTENT_RELPATH}/**/*.tests.ts'`,
							`--ignore '**/~~*/**'`,
						].join(" ")
				}

				// TODO better naming convention
				if (pkg_details.languages.has("ts")) {
					scripts["check:ts"] = `echo "${pkg_details.fqname}" && tsc --noEmit`
					scripts["watch:check:ts"] = "tsc --noEmit --watch"
					scripts["dev"] = `run-s ${scriptsⵧclean.length ? "clean" : ""} watch:check:ts`
				} else {
					//scripts['dev'] = TODO ??
				}

				if (pkg_details.isꓽpublished) {
					// TODO 1D resurrect this feature
					//scripts["check:size"] = "size-limit"
				}

				// TODO 1D smoke tests

				const scriptsⵧchecks = Object.keys(scripts)
					.filter((k) => k.startsWith("test") || k.startsWith("check"))
					.filter((k) => !k.endsWith("--watch"))
					.sort()
					.reverse() // do that "test" is before "check"
				if (scriptsⵧchecks.length) {
					const name =
						pkg_details.status === "stable" // TODO improve this status check
							? "check"
							: "_check"

					scripts[name] = `run-s ${scriptsⵧchecks.join(" ")}`
				}

				if (pkg_details.entrypointⵧdemo) {
					switch (pkg_details.entrypointⵧdemo.ext) {
						case ".js": {
							scripts["demo"] =
								`${NODE_INVOCATION} ./${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧdemo.path‿rel)}`
							break
						}
						case ".ts": {
							scripts["demo"] =
								`${NODE_INVOCATION} ./${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧdemo.path‿rel)}`
							break
						}

						case ".html": {
							// other plugins take care of this one
							break
						}

						default:
							throw new Error(`Not implemented: demo with extension "${pkg_details.entrypointⵧdemo.ext}"!`)
					}
				}
				if (pkg_details.entrypointⵧsandbox) {
					switch (pkg_details.entrypointⵧsandbox.ext) {
						case ".js": {
							scripts["sandbox"] =
								`${NODE_INVOCATION} ./${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧsandbox.path‿rel)}`
							break
						}
						case ".ts": {
							scripts["sandbox"] =
								`${NODE_INVOCATION} ./${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧsandbox.path‿rel)}`
							break
						}

						case ".html": {
							// other plugins take care of this one
							break
						}

						default:
							throw new Error(`Not implemented: sandbox with extension "${pkg_details.entrypointⵧsandbox.ext}"!`)
					}
				}

				/////// Start

				if (pkg_details.isꓽapp) {
					if (pkg_details.target === "system") {
						scripts["start"] =
							`${NODE_INVOCATION} ./${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)}`
					} else {
						// other plugins take care of this one
					}
				}

				/////// build
				Object.entries(pkg_details.entrypointsⵧbuild).forEach(([key, entry]) => {
					if (key.startsWith("build--")) key = key.slice("build--".length)
					scripts[`_build:${key}`] = (() => {
						if (entry.ext === ".ts") {
							return `${NODE_INVOCATION} ./${entry.path‿rel}`
						}

						throw new Error(`Build format not implemented! (${entry.path‿rel})`)
					})()
				})

				if (Object.keys(pkg_details.entrypointsⵧbuild).length === 0 && pkg_details.isꓽpublished) {
					if (pkg_details.languages.has("ts")) {
						scripts["_build:prod"] = "monorepo-script--build-typescript-package"
					}
				}

				const scriptsⵧbuild = Object.keys(scripts)
					.filter((k) => k.startsWith("build") || k.startsWith("_build"))
					.sort()
				if (scriptsⵧbuild.length) {
					const name =
						pkg_details.status === "stable" // TODO improve this status check
							? "build"
							: "_build"
					scripts[name] = `run-s ${scriptsⵧbuild.join(" ")}`
				}

				// misc
				if (pkg_details.isꓽpublished) {
					scripts["np"] = "np --no-publish"
					scripts["prepublishOnly"] = "run-s clean build ensure-size"
				}

				return scripts
			})()
			if (Object.keys(pkg.scripts).length === 0) {
				delete pkg.scripts
				if (pkg.devDependencies?.["npm-run-all"]) {
					delete pkg.devDependencies["npm-run-all"]
				}
			}

			if (pkg_details.isꓽpublished) {
				pkg.repository =
					`https://github.com/Offirmo/offirmo-monorepo/tree/main/` +
					path.relative(state.graphs.nodesⵧscm["/"].path‿abs, node.path‿abs)
				pkg.homepage = pkg.repository + "/README.md"
				pkg.bugs = {
					url: "https://github.com/Offirmo/offirmo-monorepo/issues",
				}
				pkg.files = ["dist", PURE_MODULE_CONTENT_RELPATH]
				throw new Error(`Not implemented!`)
			}

			Object.entries(pkg_details._manifest._overrides?.files?.packageᐧjson || {}).forEach(([path, value]) => {
				pkg = setꓽpropertyⵧdeep(pkg, path, value)
			})
		}

		const output_packageᐧjson: FileOutputPresent = {
			parent_node: node,
			manifest: manifestꓽpackageᐧjson,
			intent: "present--containing",
			content: pkg,
		}
		state = StateLib.requestꓽfile_output(state, output_packageᐧjson)

		return state
	},
}
export default PLUGIN

/////////////////////////////////////////////////

import * as path from "node:path"

import * as PkgDetailsLib from "@infinite-monorepo/package-details"
import * as StateLib from "@infinite-monorepo/state"
import type { State, FileOutputPresent } from "@infinite-monorepo/types-for-plugins"
import {
	type StructuredFsⳇFileManifest,
	type Node,
	PATHVARⵧROOTⵧPACKAGE,
	type PackagePathⳇRelative,
	type PkgFQName,
	type Plugin,
} from "@infinite-monorepo/types-for-plugins"

import { assert_from, assert } from "@monorepo-private/assert"
import { trim_before_stringify } from "@monorepo-private/json-stable-stringify"
import { mergeⵧdeep } from "@monorepo-private/merge"
import { setꓽpropertyⵧdeep } from "@monorepo-private/set-deep-property"
import type { Immutable } from "@monorepo-private/ts--types"
