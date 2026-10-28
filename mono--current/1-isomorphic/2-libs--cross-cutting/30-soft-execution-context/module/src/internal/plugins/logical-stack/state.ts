/////////////////////////////////////////////////

export interface State {
	stack: Stack
}

export function create(parent_state: State | undefined): State {
	const stack = parent_state ? Object.create(parent_state.stack) : Object.create(null)

	stack.operation = undefined // should never inherit this one

	return {
		stack,
	}
}

export function set_module(state: State, module: string): State {
	if (state.stack.module === module) return state // it's ok to inherit

	if (Object.hasOwn(state.stack, "module")) throw new Error(`SXC LogicalStack "module" unexpected override!`)

	// REMINDER "stack" is a prototypically inherited object
	// it MUST be mutated and not re-created
	state.stack.module = module

	return {
		...state,
	}
}

export function set_operation(state: State, operation: string): State {
	if (Object.hasOwn(state.stack, "operation") && state.stack.operation)
		throw new Error(`SXC LogicalStack "operation" unexpected override!`)

	// REMINDER "stack" is a prototypically inherited object
	// it MUST be mutated and not re-created
	state.stack.operation = operation

	return {
		...state,
	}
}

/////////////////////////////////////////////////
// TS module augmentation

import "../types.ts"
declare module "../types.ts" {
	interface InternalSXCⳇStateⳇPlugins {
		logical_stack: State
	}
}

/////////////////////////////////////////////////

import type { Stack } from "./types.ts"
