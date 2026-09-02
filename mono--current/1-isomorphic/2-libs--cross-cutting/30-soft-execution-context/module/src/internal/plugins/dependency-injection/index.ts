import { INTERNAL_PROP } from "../../consts.ts"
import * as TopState from "../../state.ts"
import { flattenOwnAndInheritedProps } from "../../utils.ts"
import type { SXCPlugin } from "../types.ts"

import * as StateFns from "./state.ts"
import { type State } from "./state.ts"

const PLUGIN_ID: SXCPlugin["id"] = "dependency_injection"

const PLUGIN: SXCPlugin = {
	id: PLUGIN_ID,
	state: StateFns,
	augment: (prototype) => {
		prototype.injectDependencies = function injectDependencies(deps: Record<string, any>) {
			let root_state = this[INTERNAL_PROP]

			root_state = TopState.reduce_plugin<State>(root_state, PLUGIN_ID, (state) => {
				Object.entries(deps).forEach(([key, value]) => {
					if (key === "SXC") throw new Error(`SXC.injectDependencies() forbidden internal property "SXC"!`)
					state = StateFns.injectDependency(state, key, value)
				})
				return state
			})

			this[INTERNAL_PROP] = root_state

			return this // for chaining
		}

		prototype.getInjectedDependencies = function getInjectedDependencies() {
			const plugin_state = this[INTERNAL_PROP].plugins[PLUGIN_ID]

			// TODO review: why do we have to flatten? benefit?
			return {
				...flattenOwnAndInheritedProps(plugin_state.context),
				SXC: this,
			}
		}
	},
}

export { PLUGIN_ID, PLUGIN }
