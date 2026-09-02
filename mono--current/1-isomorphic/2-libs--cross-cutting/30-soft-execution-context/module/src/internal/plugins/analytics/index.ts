import { getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"

import { INTERNAL_PROP } from "../../consts.ts"
import * as TopState from "../../state.ts"
import { flattenOwnAndInheritedProps } from "../../utils.ts"
import { PLUGIN_ID as PLUGIN_ID_DI } from "../dependency-injection/index.ts"
import type { SXCPlugin } from "../types.ts"

import * as StateFns from "./state.ts"
import { type State } from "./state.ts"

const PLUGIN_ID: SXCPlugin["id"] = "analytics"

const PLUGIN: SXCPlugin = {
	id: PLUGIN_ID,
	state: StateFns,
	augment: (prototype) => {
		prototype.setAnalyticsDetails = function setAnalyticsDetails(details: Record<string, any>) {
			const SXC = this
			let root_state = SXC[INTERNAL_PROP]

			root_state = TopState.reduce_plugin<State>(root_state, PLUGIN_ID, (plugin_state) => {
				Object.entries(details).forEach(([key, value]) => {
					plugin_state = StateFns.addDetail(plugin_state, key, value)
				})
				return plugin_state
			})

			this[INTERNAL_PROP] = root_state

			return SXC // for chaining
		}
		prototype.getAnalyticsDetails = function getAnalyticsDetails(): Record<string, any> {
			const SXC = this
			const plugin_state = SXC[INTERNAL_PROP].plugins[PLUGIN_ID]

			return flattenOwnAndInheritedProps(plugin_state.details)
		}

		prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId: string, details: Record<string, any> = {}) {
			const SXC = this
			const now = getꓽUTC_timestamp‿ms()
			const root_state = SXC[INTERNAL_PROP]

			if (!eventId) throw new Error("Incorrect eventId!")

			const { ENV } = SXC.getInjectedDependencies()

			const autoDetails = {
				ENV,
				TIME: now,
				SESSION_DURATION_MS: now - root_state.plugins[PLUGIN_ID_DI].context.SESSION_START_TIME_MS,
			}
			const existingDetails = SXC.getAnalyticsDetails()
			details = {
				...autoDetails,
				...existingDetails,
				...details,
			}

			SXC.emitter.emit("analytics", { SXC, eventId, details })

			return SXC // for chaining
		}
	},
}

export { PLUGIN_ID, PLUGIN }
