/////////////////////////////////////////////////

interface State {
	context: Record<string, any>
}

function create(parent_state: State | undefined) {
	const context = parent_state ? Object.create(parent_state.context) : Object.create(null) // NO auto-injections here, let's keep it simple. See core & common

	return {
		context,
	}
}

function injectDependency(state: State, key: string, value: any): State {
	if (Object.hasOwn(state.context, key) && state.context[key] === value) {
		// no change
		return state
	}

	// REMINDER "context" is a prototypically inherited object
	// it MUST be mutated and not re-created
	state.context[key] = value

	return {
		...state,
	}
}

/////////////////////////////////////////////////

export { type State, create, injectDependency }
