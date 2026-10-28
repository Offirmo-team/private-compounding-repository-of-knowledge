// Note: let's keep everything immutable

import type { InternalSXCⳇStateⳇPlugins, SXCPlugin } from "./plugins/types.ts"
import type { InternalSXCⳇState } from "./types.ts"

/////////////////////////////////////////////////

let instance_count = 0
function create(parent_state: InternalSXCⳇState | undefined): InternalSXCⳇState {
	return {
		sid: instance_count++, // not really useful yet, but helps debug
		parent: parent_state,
		plugins: {} as InternalSXCⳇStateⳇPlugins, // will be initialized immediately, not worth under-typing
		cache: {}, // per-SXC cache for complex computations
	}
}

function activate_plugin<PluginState = {}>(
	state: InternalSXCⳇState,
	PLUGIN: SXCPlugin<PluginState> /*, args*/,
): InternalSXCⳇState {
	const plugin_parent_state = state.parent?.plugins?.[PLUGIN.id] as PluginState | undefined

	const plugin_state = PLUGIN.state.create(plugin_parent_state)

	return {
		...state,
		plugins: {
			...state.plugins,
			[PLUGIN.id]: {
				...plugin_state,
				sid: state.sid, // propagate sid. Not really useful yet, but helps debug
			},
		},
	}
}

function reduce_plugin<PluginState>(
	state: InternalSXCⳇState,
	PLUGIN_ID: SXCPlugin["id"],
	reducer: (s: PluginState) => PluginState,
): InternalSXCⳇState {
	const initial_plugin_state = state.plugins[PLUGIN_ID] as PluginState
	const new_plugin_state = reducer(initial_plugin_state)

	if (new_plugin_state === initial_plugin_state) return state // no change (immutability expected)

	return {
		...state,
		plugins: {
			...state.plugins,
			[PLUGIN_ID]: new_plugin_state,
		},
	}
}

/////////////////////////////////////////////////

export {
	type InternalSXCⳇState, // for convenience
	create,
	activate_plugin,
	reduce_plugin,
}
