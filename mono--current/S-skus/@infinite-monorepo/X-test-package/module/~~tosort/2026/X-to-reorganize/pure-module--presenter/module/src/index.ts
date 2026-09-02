/* PROMPT
 * ’
 */
import { strict as assert } from "node:assert"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as process from "node:process"

import { type Basename, type PureModuleDetails } from "@infinite-monorepo/package-details"
import { PkgInfosResolver } from "@infinite-monorepo/pkg-infos-resolver"
import { writeJsonFile as write_json_file } from "write-json-file" // full pkg is too useful, ex. preserve indent

import { setꓽpropertyⵧdeep } from "@monorepo-private/set-deep-property"

/////////////////////////////////////////////////

function isAncestorDir(parent: string, child: string): boolean {
	const parentDirs = parent.split(path.sep).filter((dir) => !!dir)
	const childDirs = child.split(path.sep).filter((dir) => !!dir)
	return parentDirs.every((dir, i) => childDirs[i] === dir)
}

/////////////////////////////////////////////////

interface Params {
	pure_module_path: string
	pkg_details: PureModuleDetails
	dest_dir: string
	git_root: string
	bolt_root: string
	ts__custom_types__path: string

	indent: string

	pkg_infos_resolver?: PkgInfosResolver
}

// TODO configurable
const NODE__OPTIONS = `--env-file-if-exists=.env.local --experimental-webstorage --localstorage-file=.node-ls.local`
const NODE_INVOCATION = `node ${NODE__OPTIONS}` //  --experimental-strip-types

async function present({
	indent = "",

	pure_module_path,
	pkg_details,
	dest_dir,

	git_root,
	bolt_root,
	ts__custom_types__path,

	pkg_infos_resolver, // = new PkgInfosResolver(),
}: Params) {
	const dest_dir‿abspath = path.resolve(dest_dir)
	assert(process.env["HOME"], `$HOME is expected to be set!`)
	const dest_dir__from_HOME‿rel = path.relative(process.env["HOME"], dest_dir‿abspath)
	console.log(`${indent}🗃  exposing pure code module to "${dest_dir‿abspath}"…`)

	if (isAncestorDir(pkg_details.root‿abspath, dest_dir‿abspath)) {
		throw new Error(`Out-of-source build cannot target inside the pure-module!`)
	}

	if (pkg_details._manifest?._dontꓽpresent) {
		console.log(`${indent}marked as "do not present", skipping`)
		return
	}

	/////////////////////////////////////////////////
	const ೱpromises: Array<Promise<void>> = []

	/////////////////////////////////////////////////
	// prepare: clean up

	const PURE_MODULE_CONTENT_RELPATH = path.basename(pure_module_path)
	const SRC_RELPATH = path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)
	const SRC_DIR_RELPATH = path.dirname(SRC_RELPATH)

	// out-of-source build (NOT working at the moment)
	if (isAncestorDir(dest_dir‿abspath, pkg_details.root‿abspath)) {
		// the pure module is inside the target dir
		// do not remove any file
		// TODO one day clear everything except the pure-module
	} else {
		await fs.rm(dest_dir‿abspath, { recursive: true, force: true })
		await fs.mkdir(dest_dir‿abspath, { recursive: true })

		ೱpromises.push(
			fs.symlink(pkg_details.root‿abspath, path.resolve(dest_dir‿abspath, PURE_MODULE_CONTENT_RELPATH), "dir"),
		)
	}

	/////////////////////////////////////////////////
	// create files
	function _schedule_root_file_creation(basename: Basename, content: string | object) {
		const target_file‿abspath = path.resolve(dest_dir‿abspath, basename)

		if (typeof content == "string") {
			content = content.trimStart()
			if (!content.endsWith("\n")) content += "\n"

			ೱpromises.push(fs.writeFile(target_file‿abspath, content, { encoding: "utf-8" }))
			return
		}

		ೱpromises.push(write_json_file(target_file‿abspath, content))
	}

	/* TODO only when more content than this
	_schedule_root_file_creation('README.md', `
# ${pkg_details.fqname}

${pkg_details.description || ''}
`.trim() + '\n,
		{ encoding: 'utf-8' },
	))
	*/

	// https://github.com/jonathaneunice/iterm2-tab-set
	// ?? can't find a reference to folder .tabset?
	// and it's set by the shortcut itself?
	// TODO review
	//_schedule_root_file_creation('.tabset', `tabset --badge $1 --color "#a4d4dd"`)
	ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, ".tabset"), { force: true }))

	// ✅ MIGRATED ✅
	if (pkg_details.languages.has("ts")) {
		_schedule_root_file_creation("tsconfig.json", {
			$schema: "https://json.schemastore.org/tsconfig",

			extends: [
				pkg_details.engines["browser"]
					? "@monorepo-private/config--typescript/module/src/current/dom/tsconfig.json"
					: pkg_details.depsⵧdev.has("@types/node")
						? "@monorepo-private/config--typescript/module/src/current/node/tsconfig.json"
						: "@monorepo-private/config--typescript/module/src/current/isomorphic/tsconfig.json",
			],
			compilerOptions: {
				...(pkg_details.engines["browser"] && {
					lib: [
						"ES2025", // update marker
						"DOM",
					],
				}),
				pretty: true, // placeholder for adding stuff / helping diffs
			},
			include: [
				path.relative(dest_dir‿abspath, ts__custom_types__path) + "/*.d.ts",
				`${PURE_MODULE_CONTENT_RELPATH}/**/*.ts`,
				...(pkg_details.engines["browser"] ? [`${PURE_MODULE_CONTENT_RELPATH}/**/*.tsx`] : []),
			],
			exclude: ["**/~~*/**/*"],
		})
	} else {
		ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "tsconfig.json"), { force: true }))
	}

	// ✅ MIGRATED ✅
	if (pkg_details.engines["browser"]) {
		_schedule_root_file_creation(".parcelrc", {
			extends: "@monorepo-private/parcel-config",
		})
		_schedule_root_file_creation(
			"vite.config.ts",
			`
import { extend_default_config } from "@monorepo-private/vite--config--default"

export default extend_default_config({})
`,
		)
	} else {
		ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, ".parcelrc"), { force: true }))
		ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "vite.config.ts"), { force: true }))
	}

	// ✅ MIGRATED ✅
	if (pkg_details.depsⵧvendored.size) {
		throw new Error(`Not implemented!`)
		// TODO link + declare in private entries
	}

	const packageᐧjson = await (async () => {
		const enginesⵧcleaned = Object.fromEntries(
			Object.entries(pkg_details.engines).filter(([k, v]) => {
				if (k === "browser") {
					// not a formal engine
					// also Parcel complains about it
					return false
				}

				return true
			}),
		)
		let pkg: any = {
			// ✅ MIGRATED ✅
			name: pkg_details.fqname,
			...(pkg_details.description && { description: pkg_details.description }),
			version: pkg_details.version,
			...(pkg_details.isꓽpublished && { author: pkg_details.author }),
			...(pkg_details.license && { license: pkg_details.license }),
			...(pkg_details.isꓽpublished ? {} : { private: true }),

			// ✅ MIGRATED ✅
			...(Object.keys(enginesⵧcleaned).length && { engines: enginesⵧcleaned }),
			sideEffects: pkg_details.hasꓽside_effects || pkg_details.isꓽapp,

			// ✅ MIGRATED ✅
			type: "module",
			exports: {
				".": "./" + SRC_RELPATH,
			},
			source: SRC_RELPATH,
		}

		Object.keys(pkg_details.entrypointⵧexports)
			.sort()
			.forEach((k) => {
				pkg.exports[k] = "./" + path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧexports[k]!.path‿rel)
			})

		const all_declared_deps: Set<string> = new Set<string>()
			.union(pkg_details.depsⵧnormal)
			.union(pkg_details.depsⵧdev)
			.union(pkg_details.depsⵧpeer)
			.union(pkg_details.depsⵧoptional)
		// ignoring vendored: to be copied, not declared

		Array.from(all_declared_deps.values()).forEach((dep) => pkg_infos_resolver.preload(dep))
		await pkg_infos_resolver.all_pending_loaded()
		Array.from(all_declared_deps.values()).forEach((dep) => pkg_infos_resolver.add_to_catalog(dep))

		if (pkg_details.depsⵧpeer.size) {
			pkg.peerDependencies = Object.fromEntries(
				Array.from(pkg_details.depsⵧpeer)
					.sort()
					.map((dep) => [dep, pkg_infos_resolver.ǃgetꓽversionⵧfor_dep(dep)]),
			)
		}

		pkg.dependencies = Object.fromEntries(
			Array.from(pkg_details.depsⵧnormal)
				.sort()
				.map((dep) => [dep, pkg_infos_resolver.ǃgetꓽversionⵧfor_dep(dep)]),
		)
		if (pkg_details.depsⵧoptional.size) {
			pkg.optionalDependencies = Object.fromEntries(
				Array.from(pkg_details.depsⵧoptional)
					.sort()
					.map((dep) => [dep, pkg_infos_resolver.ǃgetꓽversionⵧfor_dep(dep)]),
			)
		}

		pkg.scripts = (() => {
			const scripts: Record<string, string> = {}

			/////// order is important

			/////// Clean
			const monorepo_clean_targets = new Set<string>()
			if (pkg_details.isꓽpublished) {
				monorepo_clean_targets.add("…dist")
			}
			if (pkg_details.engines["browser"]) {
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
					`${NODE_INVOCATION} ./node_modules/.bin/mocha -- --bail --config ./node_modules/@monorepo-private/toolbox--unit-tests/module/mocharc.json ./node_modules/@monorepo-private/toolbox--unit-tests/module/mocha-chai-init-node.mjs './${SRC_DIR_RELPATH}/**/*.tests.ts'`
				//  --experimental-require-module
			}

			if (pkg_details.languages.has("ts")) {
				scripts["check--ts"] = `echo "${pkg_details.fqname}" && tsc --noEmit`
				scripts["check--ts--watch"] = "tsc --noEmit --watch"
				scripts["dev"] = scriptsⵧclean.length ? `run-s clean check--ts--watch` : `run-s check--ts--watch`
			} else {
				//scripts['dev'] = TODO ??
			}

			if (pkg_details.isꓽpublished) {
				// TODO one day "check--size" once this feature is resurrected
				scripts["ensure--size"] = "size-limit"
			}

			// TODO smoke tests

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

			const PARCEL__COMMON_OPTIONS = [
				"--port 1981", // because parcel caches with bugs, so we can't have several running anyway
				"--lazy", // because faster
				"--no-autoinstall", // we don't want to auto-install anything, if missing = it's on us
				//'--no-hmr', // because of bug https://github.com/parcel-bundler/parcel/issues/8181
				// it seems to work for now...
			].join(" ")
			const VITE__COMMON_OPTIONS = ["--port 1981", "--strictPort", "--logLevel info"].join(" ")

			if (pkg_details.hasꓽstories || pkg_details.entrypointⵧstorypad) {
				assert(pkg_details.entrypointⵧstorypad, `Expected storypad to be defined!`)
				scripts["_start:parcel:storypad"] =
					`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧstorypad.path‿rel)} ${PARCEL__COMMON_OPTIONS}`
				scripts["_start:vite:storypad"] =
					`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧstorypad.path‿rel)}`
				scripts["storiesp"] = `npm-run-all clean --parallel _start:parcel:storypad`
				scripts["stories"] = `npm-run-all clean --parallel _start:vite:storypad`
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
						scripts["_start:parcel:demo"] =
							`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧdemo.path‿rel)} ${PARCEL__COMMON_OPTIONS}`
						scripts["_start:vite:demo"] =
							`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧdemo.path‿rel)}`
						scripts["demop"] = `npm-run-all clean --parallel _start:parcel:demo`
						scripts["demo"] = `npm-run-all clean --parallel _start:vite:demo`
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
						scripts["_start:vite:sandbox"] =
							`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧsandbox.path‿rel)}`
						scripts["_start:parcel:sandbox"] =
							`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧsandbox.path‿rel)} ${PARCEL__COMMON_OPTIONS}`
						scripts["sandboxp"] = `npm-run-all clean --parallel _start:parcel:sandbox`
						scripts["sandbox"] = `npm-run-all clean --parallel _start:vite:sandbox`
						break
					}

					default:
						throw new Error(`Not implemented: sandbox with extension "${pkg_details.entrypointⵧsandbox.ext}"!`)
				}
			}

			/////// Start
			if (pkg_details.entrypointⵧmain.ext === ".html") {
				scripts["_start:vite:main"] =
					`vite ${VITE__COMMON_OPTIONS} --open ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)}`
				scripts["_start:parcel:main"] =
					`parcel serve ${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)} ${PARCEL__COMMON_OPTIONS}`
			}
			if (pkg_details.isꓽapp) {
				if (Object.keys(pkg_details.engines).length === 0 || pkg_details.engines["node"]) {
					scripts["start"] =
						`${NODE_INVOCATION} ./${path.join(PURE_MODULE_CONTENT_RELPATH, pkg_details.entrypointⵧmain.path‿rel)}`
				} else {
					if (scripts["_start:parcel:main"]) {
						scripts["startp"] = `npm-run-all clean --parallel _start:parcel:main`
						scripts["start"] = `npm-run-all clean --parallel _start:vite:main`
					}
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

		if (pkg_details.depsⵧdev.size) {
			pkg.devDependencies = Object.fromEntries(
				Array.from(pkg_details.depsⵧdev)
					.sort()
					.map((dep) => [dep, pkg_infos_resolver.ǃgetꓽversionⵧfor_dep(dep)]),
			)
		}

		if (pkg_details.isꓽpublished) {
			pkg.repository =
				`https://github.com/Offirmo/offirmo-monorepo/tree/main/` + path.relative(git_root, dest_dir‿abspath)
			pkg.homepage = pkg.repository + "/README.md"
			pkg.bugs = {
				url: "https://github.com/Offirmo/offirmo-monorepo/issues",
			}
			pkg.files = ["dist", "module"]
		}

		Object.entries(pkg_details._manifest._overrides?.files?.packageᐧjson || {}).forEach(([path, value]) => {
			pkg = setꓽpropertyⵧdeep(pkg, path, value)
		})

		return pkg
	})()
	_schedule_root_file_creation("package.json", packageᐧjson)

	if (pkg_details.hasꓽtestsⵧunit) {
		_schedule_root_file_creation(
			"webstorm--tests--unit.run.xml",
			`
<component name="ProjectRunConfigurationManager">
	<configuration default="false" name="${pkg_details.fqname} -- TESTS -- UNIT" type="mocha-javascript-test-runner">
		<node-interpreter>project</node-interpreter>
		<node-options>${NODE__OPTIONS}</node-options>
		<mocha-package>$USER_HOME$/${path.relative(process.env["HOME"], path.resolve(bolt_root))}/node_modules/mocha</mocha-package>
		<working-directory>$USER_HOME$/${dest_dir__from_HOME‿rel}</working-directory>
		<pass-parent-env>true</pass-parent-env>
		<ui>bdd</ui>
		<extra-mocha-options>--bail</extra-mocha-options>
		<test-kind>PATTERN</test-kind>
		<test-pattern>./module/**/*.tests.ts</test-pattern>
		<method v="2" />
	</configuration>
</component>
`,
		)
	} else {
		ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "webstorm--tests--unit.xml"), { force: true }))
	}
	// old format
	ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "webstorm--UT.run.xml"), { force: true }))

	if (pkg_details.hasꓽtestsⵧevals) {
		_schedule_root_file_creation(
			"webstorm--tests--evals.run.xml",
			`
<component name="ProjectRunConfigurationManager">
	<configuration default="false" name="${pkg_details.fqname} -- TESTS -- EVALS" type="mocha-javascript-test-runner">
		<node-interpreter>project</node-interpreter>
		<node-options>${NODE__OPTIONS}</node-options>
		<mocha-package>$USER_HOME$/${path.relative(process.env["HOME"], path.resolve(bolt_root))}/node_modules/mocha</mocha-package>
		<working-directory>$USER_HOME$/${dest_dir__from_HOME‿rel}</working-directory>
		<pass-parent-env>true</pass-parent-env>
		<ui>bdd</ui>
		<extra-mocha-options>--bail</extra-mocha-options>
		<test-kind>PATTERN</test-kind>
		<test-pattern>./module/**/*.evals.ts</test-pattern>
		<method v="2" />
	</configuration>
</component>
`,
		)
	} else {
		ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "webstorm--tests--evals.run.xml"), { force: true }))
	}

	if (pkg_details.entrypointⵧdemo) {
		if (pkg_details.entrypointⵧdemo.ext === ".ts") {
			_schedule_root_file_creation(
				"webstorm--demo.run.xml",
				`
<component name="ProjectRunConfigurationManager">
	<configuration default="false" type="NodeJSConfigurationType"
		name="${pkg_details.fqname} -- Demo"
		working-dir="$USER_HOME$/${dest_dir__from_HOME‿rel}"
		path-to-js-file="${path.relative(dest_dir, pkg_details.entrypointⵧdemo.path‿abs)}">
		<node-interpreter>project</node-interpreter>
		<node-options>${NODE__OPTIONS}</node-options>
		<method v="2" />
	</configuration>
</component>
`,
			)
		} else {
			ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "webstorm--demo.run.xml"), { force: true }))
		}

		if (pkg_details.entrypointⵧdemo.ext === ".html") {
			// no extra file necessary
		}
	}

	if (pkg_details.entrypointⵧsandbox) {
		if (pkg_details.entrypointⵧsandbox.ext === ".ts") {
			_schedule_root_file_creation(
				"webstorm--sandbox.run.xml",
				`
<component name="ProjectRunConfigurationManager">
	<configuration default="false" type="NodeJSConfigurationType"
		name="${pkg_details.fqname} -- Sandbox"
		working-dir="$USER_HOME$/${dest_dir__from_HOME‿rel}"
		path-to-js-file="${path.relative(dest_dir, pkg_details.entrypointⵧsandbox.path‿abs)}">
		<node-interpreter>project</node-interpreter>
		<node-options>${NODE__OPTIONS}</node-options>
		<method v="2" />
	</configuration>
</component>
`,
			)
		} else {
			ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "webstorm--sandbox.run.xml"), { force: true }))
		}
	}

	if (packageᐧjson?.["scripts"]?.["start"]) {
		if (Object.keys(pkg_details.engines).length === 0 || pkg_details.engines["node"]) {
			_schedule_root_file_creation(
				"webstorm--start.run.xml",
				`
<component name="ProjectRunConfigurationManager">
	<configuration default="false" type="NodeJSConfigurationType"
		name="${pkg_details.fqname} -- Start"
		working-dir="$USER_HOME$/${dest_dir__from_HOME‿rel}"
		path-to-js-file="${path.relative(dest_dir, pkg_details.entrypointⵧmain.path‿abs)}">
		<node-interpreter>project</node-interpreter>
		<node-options>${NODE__OPTIONS}</node-options>
		<method v="2" />
	</configuration>
</component>
`,
			)
		} else {
			ೱpromises.push(fs.rm(path.resolve(dest_dir‿abspath, "webstorm--start.run.xml"), { force: true }))
		}
	}

	// TODO 1D .eslintrc.js

	await Promise.all(ೱpromises)
}

/////////////////////////////////////////////////

export { present, PkgInfosResolver }
