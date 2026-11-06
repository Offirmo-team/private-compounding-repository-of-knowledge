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

const webstormⳇtestsⵧunit__path‿ar: PackagePathⳇRelative = `${PATHVARⵧROOTⵧPACKAGE}/webstorm--tests--unit.run.xml`
export const manifestꓽwebstormⳇtestsⵧunit: StructuredFsⳇFileManifest = {
	path‿ar: webstormⳇtestsⵧunit__path‿ar,
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
		state = StateLib.declareꓽfile_manifest(state, manifestꓽwebstormⳇtestsⵧunit)

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
				//state = requestꓽrun_configⵧtestsⵧunit(state, node)
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

	if (!pkg_details.hasꓽtestsⵧunit || !pkg_details.depsⵧdev.has("vitest")) {
		// also cleans up the legacy mocha configs
		const output_spec: FileOutputAbsent = {
			parent_node: node,
			path‿ar: webstormⳇtestsⵧunit__path‿ar,
			intent: "not-present",
		}
		return StateLib.requestꓽfile_output(state, output_spec)
	}

	const pkg_dir = `$PROJECT_DIR$/${path.relative(getꓽide_project_root‿abs(state), node.path‿abs)}`
	const output_spec: FileOutputPresent = {
		parent_node: node,
		manifest: manifestꓽwebstormⳇtestsⵧunit,
		intent: "present--exact",
		content: {
			text: `<component name="ProjectRunConfigurationManager">
	<configuration default="false" name="${escapeꓽxml_attribute(`${pkg_details.fqname} -- TESTS -- UNIT`)}" type="JavaScriptTestRunnerVitest">
		<node-interpreter value="project" />
		<vitest-package value="${escapeꓽxml_attribute(`${pkg_dir}/node_modules/vitest`)}" />
		<working-dir value="${escapeꓽxml_attribute(pkg_dir)}" />
		<vitest-options value="${escapeꓽxml_attribute(VITEST_OPTIONS)}" />
		<envs />
		<scope-kind value="ALL" />
		<method v="2" />
	</configuration>
</component>
`,
		},
	}
	return StateLib.requestꓽfile_output(state, output_spec)
}

// = $PROJECT_DIR$, assuming the JetBrains project is opened at the git repo root
function getꓽide_project_root‿abs(state: Immutable<State>): string {
	const repo_node = Object.values(state.graphs.nodesⵧscm).find((n) => n.type === "repository")
	return repo_node?.path‿abs ?? StateLib.getꓽnodeⵧmonorepo(state).path‿abs
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
