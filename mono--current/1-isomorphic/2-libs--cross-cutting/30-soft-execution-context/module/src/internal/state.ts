// Note: let's keep everything immutable

import type { SXCPlugin } from "./plugins/types.ts"
import type { InternalSXCState } from "./types.ts"

/////////////////////////////////////////////////

let instance_count = 0
function create(parent_state: InternalSXCState | undefined): InternalSXCState {
	return {
		sid: instance_count++, // not really useful yet, but helps debug
		parent: parent_state,
		plugins: {},
		cache: {}, // per-SXC cache for complex computations
	}
}

function activate_plugin<PluginState = {}>(
	state: InternalSXCState,
	PLUGIN: SXCPlugin<PluginState> /*, args*/,
): InternalSXCState {
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
	state: InternalSXCState,
	PLUGIN_ID: SXCPlugin["id"],
	reducer: (s: PluginState) => PluginState,
): InternalSXCState {
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
	type InternalSXCState, // for convenience
	create,
	activate_plugin,
	reduce_plugin,
}
