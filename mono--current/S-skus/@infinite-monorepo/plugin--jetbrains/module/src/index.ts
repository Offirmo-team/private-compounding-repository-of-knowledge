/////////////////////////////////////////////////

const ᐧideaⳇᐧgitignore__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.idea/.gitignore`
export const manifestꓽᐧideaⳇᐧgitignore: StructuredFsⳇFileManifest = {
	path‿ar: ᐧideaⳇᐧgitignore__path‿ar,
	doc: ["https://git-scm.com/docs/gitignore"],
}

const ᐧideaⳇrequired_plugins__path‿ar: NodePathⳇRelative = `${PATHVARⵧROOTⵧNODE}/.idea/required_plugins.xml`
export const manifestꓽᐧideaⳇrequired_plugins: StructuredFsⳇFileManifest = {
	path‿ar: ᐧideaⳇrequired_plugins__path‿ar,
	doc: ["https://www.jetbrains.com/help/idea/managing-plugins.html#required-plugins"],
}

const webstormⳇrunfileⳇtestsⵧunitⵧvitest__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/webstorm--vitest.run.xml`
export const manifestꓽwebstormⳇrunfileⳇtestsⵧunitⵧvitest: StructuredFsⳇFileManifest = {
	path‿ar: webstormⳇrunfileⳇtestsⵧunitⵧvitest__path‿ar,
	format: "text", // .xml is not inferrable
	doc: [
		"https://www.jetbrains.com/help/webstorm/vitest.html",
		"https://www.jetbrains.com/help/webstorm/run-debug-configuration.html#share-configurations",
	],
}

// keep in sync with the "test--vitest" script from @infinite-monorepo/plugin--pm--package-json
const VITEST_OPTIONS = `--dir module --exclude **/~~*/**` // no shell = no quotes needed

/////////////////////////////////////////////////

export const PLUGIN: Plugin = {
	onꓽload(state: Immutable<State>): Immutable<State> {
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧideaⳇᐧgitignore)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽᐧideaⳇrequired_plugins)
		state = StateLib.declareꓽfile_manifest(state, manifestꓽwebstormⳇrunfileⳇtestsⵧunitⵧvitest)

		return state
	},

	onꓽapply(state: Immutable<State>, node: Immutable<Node>) {
		switch (node?.type) {
			case "monorepo": {
				const output_specꓽᐧgitignore: FileOutputPresent = {
					parent_node: node,
					manifest: manifestꓽᐧideaⳇᐧgitignore,
					intent: "present--containing",
					content: {
						entries: [
							`## contains auto-generated content from @infinite-monorepo/plugin--jetbrains`,

							// from default WebStorm
							"/shelf/",
							"/workspace.xml",

							// personal, pragmatic additions
							// last review 2026/09
							"*.iml", // contains local infos
							"vcs.xml", // VCS infos, IDE can regen on its own
							"modules.xml", // contains dirs added to the project, personal IMO
							"markdown.xml", // as of 2026/11 private preferences
						],
					},
				}
				state = StateLib.requestꓽfile_output(state, output_specꓽᐧgitignore)
				break
			}
			case "package": {
				state = requestꓽrun_configⵧtestsⵧunit(state, node)
				break
			}
			default:
				break
		}

		return state
	},
}
export default PLUGIN

/////////////////////////////////////////////////

function requestꓽrun_configⵧtestsⵧunit(state: Immutable<State>, node: Immutable<NodeⳇPackage>): Immutable<State> {
	const pkg_details = node.details
	if (pkg_details._error) {
		return state // not our concern
	}

	// Cleanup: legacy mocha-only config
	const cleanup_spec: FileOutputAbsent = {
		parent_node: node,
		path‿ar: `${PATHVARⵧROOTⵧPACKAGE}/webstorm--tests--unit.run.xml`,
		intent: "not-present",
	}
	state = StateLib.requestꓽfile_output(state, cleanup_spec)

	if (!pkg_details.hasꓽtestsⵧunit) {
		// cleanup if any
		const output_spec: FileOutputAbsent = {
			parent_node: node,
			path‿ar: webstormⳇrunfileⳇtestsⵧunitⵧvitest__path‿ar,
			intent: "not-present",
		}
		return StateLib.requestꓽfile_output(state, output_spec)
	}

	const pkg_dir = `$PROJECT_DIR$/${path.relative(getꓽide_project_root‿abs(state), node.path‿abs)}`

	if (pkg_details.depsⵧdev.has("vitest")) {
		/* Real seen:
<component name="ProjectRunConfigurationManager">
	<configuration default="false" name="Demo" type="JavaScriptTestRunnerVitest">
		<node-interpreter value="project" />
		<node-options value="--nodeopts" />
		<vitest-package value="$PROJECT_DIR$/S-skus/@infinite-monorepo/plugin--readme/node_modules/vitest" />
		<working-dir value="$PROJECT_DIR$/1-isomorphic/1-libs--simple/0-assert" />
		<vitest-options value="--vitops" />
		<envs />
		<scope-kind value="ALL" />
		<EXTENSION ID="com.github.l34130.mise.core.run.MiseRunConfigurationSettingsEditor" myConfigEnvironmentStrategy="use_project_settings" myMiseDirEnvCb="true" myMiseConfigEnvironmentTf="" />
		<method v="2" />
	</configuration>
</component>
*/
		const output_spec: FileOutputPresent = {
			parent_node: node,
			manifest: manifestꓽwebstormⳇrunfileⳇtestsⵧunitⵧvitest,
			intent: "present--exact",
			content: {
				text: `
<component name="ProjectRunConfigurationManager">
	<configuration default="false" name="${escapeꓽxml_attribute(`${pkg_details.fqname} -- vitest`)}" type="JavaScriptTestRunnerVitest">
		<node-interpreter value="project" />
		<vitest-package value="${escapeꓽxml_attribute(`${pkg_dir}/node_modules/vitest/`)}" />
		<working-dir value="${escapeꓽxml_attribute(pkg_dir)}/" />
		<vitest-options value="${escapeꓽxml_attribute(VITEST_OPTIONS)}" />
		<envs />
		<scope-kind value="ALL" />
		<EXTENSION ID="com.github.l34130.mise.core.run.MiseRunConfigurationSettingsEditor" myConfigEnvironmentStrategy="use_project_settings" myMiseDirEnvCb="true" myMiseConfigEnvironmentTf="" />
		<method v="2" />
	</configuration>
</component>
`,
			},
		}
		state = StateLib.requestꓽfile_output(state, output_spec)
	}

	// no more mocha

	return state
}

// = $PROJECT_DIR$
function getꓽide_project_root‿abs(state: Immutable<State>): string {
	// assuming the JetBrains project is opened at the monorepo root
	return StateLib.getꓽnodeⵧmonorepo(state).path‿abs
}

function escapeꓽxml_attribute(raw: string): string {
	return raw.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
}

/////////////////////////////////////////////////

import * as path from "node:path"

import { type State, type FileOutputAbsent, type FileOutputPresent } from "@infinite-monorepo/state"
import * as StateLib from "@infinite-monorepo/state"
import {
	type StructuredFsⳇFileManifest,
	type Node,
	type Plugin,
	PATHVARⵧROOTⵧPACKAGE,
	type PackagePathⳇRelative,
	type NodeⳇPackage,
	type NodeⳇWorkspace,
	type NodePathⳇRelative,
	PATHVARⵧROOTⵧNODE,
} from "@infinite-monorepo/types-for-plugins"

import type { Immutable } from "@monorepo-private/ts--types"
