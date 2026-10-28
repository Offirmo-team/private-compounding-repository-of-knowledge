/////////////////////////////////////////////////

export interface State {
	details: Record<string, any>
}

export function create(parent_state: State | undefined) {
	const details = parent_state ? Object.create(parent_state.details) : Object.create(null) // NO auto-details here, let's keep it simple. See core or platform specific code.

	return {
		details,
	}
}

export function addDetail(state: State, key: string, value: any): State {
	if (Object.hasOwn(state.details, key) && state.details[key] === value) {
		// no change
		return state
	}

	// REMINDER "details" is a prototypically inherited object
	// it MUST be mutated and not re-created
	state.details[key] = value

	return {
		...state,
	}
}

/////////////////////////////////////////////////
// TS module augmentation

import "../types.ts"
declare module "../types.ts" {
	interface InternalSXCⳇStateⳇPlugins {
		analytics: State
	}
}

/////////////////////////////////////////////////
