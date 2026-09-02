import { getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"

import { LIB } from "../consts.ts"
import type { SoftExecutionContext } from "../types.ts"

import { INTERNAL_PROP } from "./consts.ts"
import { PLUGINS } from "./plugins/index.ts"
import { ROOT_PROTOTYPE } from "./root-prototype.ts"
import * as State from "./state.ts"
import type { InternalSXC } from "./types.ts"

/////////////////////////////////////////////////

ROOT_PROTOTYPE.createChild = function createChild() {
	return _createSXC(this)
}

PLUGINS.forEach((PLUGIN) => {
	PLUGIN.augment(ROOT_PROTOTYPE)
})

/////////////////////////////////////////////////

// this function should normally NOT be called directly
// use getRootSXC() or make a getLibSXC()
function _createSXC<Injections, AnalyticsDetails, ErrorDetails>(
	parent?: InternalSXC,
): SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails> {
	/////// PARAMS ///////

	if (parent && !_isSXC(parent)) throw new Error(`${LIB}›createSXC() argument error: parent must be a valid SXC!`)

	const SXC = Object.create(ROOT_PROTOTYPE)

	/////// STATE ///////
	const parent_state = parent?.[INTERNAL_PROP]
	let state = State.create(parent_state)

	PLUGINS.forEach((PLUGIN) => {
		state = State.activate_plugin(state, PLUGIN)
	})

	SXC[INTERNAL_PROP] = state

	// auto injections
	if (!parent) {
		SXC.injectDependencies({
			logger: console, // use universal debug API? NO because the placeholder = NOOP = would cause no logs visible by default
		})

		_decorateWithDetectedEnv(SXC)
	}

	// Here we could send an event on the SXC bus. No usage for now.
	// Here we could have lifecycle methods. No usage for now.

	/////////////////////

	return SXC
}

/////////////////////////////////////////////////

function _isSXC(SXC: any): SXC is SoftExecutionContext {
	return SXC && SXC[INTERNAL_PROP]
}

function _decorateWithDetectedEnv(SXC: SoftExecutionContext<any>) {
	const ENV = (() => {
		try {
			if (typeof process?.env?.["NODE_ENV"] === "string") return process.env["NODE_ENV"]
		} catch (err) {
			/* swallow */
		}

		return "development"
	})()

	const IS_DEV_MODE = false
	const IS_VERBOSE = false
	const CHANNEL = "dev"
	const SESSION_START_TIME_MS = getꓽUTC_timestamp‿ms()

	SXC.injectDependencies({
		ENV,
		IS_DEV_MODE,
		IS_VERBOSE,
		CHANNEL,
		SESSION_START_TIME_MS,
	})

	SXC.setAnalyticsAndErrorDetails({
		ENV,
		CHANNEL,
	})
}

/////////////////////////////////////////////////

export { _createSXC }
