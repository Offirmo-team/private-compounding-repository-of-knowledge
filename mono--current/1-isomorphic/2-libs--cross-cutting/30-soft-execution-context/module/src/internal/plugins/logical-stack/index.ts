import type { XXError } from "@monorepo-private/utils--error"

import { INTERNAL_PROP } from "../../consts.ts"
import * as TopStateFns from "../../state.ts"
import { type InternalSXCState } from "../../state.ts"
import { _getSXCStatePath } from "../../utils.ts"
import type { SXCPlugin } from "../types.ts"

import {
	LOGICAL_STACK_BEGIN_MARKER,
	LOGICAL_STACK_END_MARKER,
	LOGICAL_STACK_SEPARATOR,
	LOGICAL_STACK_OPERATION_MARKER,
	LOGICAL_STACK_SEPARATOR_NON_ADJACENT,
} from "./consts.ts"
import * as StateFns from "./state.ts"
import { type State } from "./state.ts"
import type { Stack } from "./types.ts"

const PLUGIN_ID: SXCPlugin["id"] = "logical_stack"

const BRANCH_JUMP_PSEUDO_STATE: InternalSXCState = {
	sid: -1,
	parent: undefined,
	plugins: {
		[PLUGIN_ID]: {
			stack: {
				// NO module
				operation: LOGICAL_STACK_SEPARATOR_NON_ADJACENT,
			},
		},
	},
	cache: {},
}

function _reduceStatePathToLogicalStack(statePath: InternalSXCState[]) {
	let current_module: Stack["module"] = undefined

	return (
		statePath.reduce((res, state) => {
			const { module, operation } = (state.plugins[PLUGIN_ID] as State).stack

			if (
				module && // check existence of module due to special case "BRANCH_JUMP_PSEUDO_STATE" above
				module !== current_module
			) {
				res = res + (res.length ? LOGICAL_STACK_SEPARATOR : "") + module
				current_module = module
			}

			if (operation) res = res + LOGICAL_STACK_SEPARATOR + operation + LOGICAL_STACK_OPERATION_MARKER

			return res
		}, "") + LOGICAL_STACK_END_MARKER
	)
}

const PLUGIN: SXCPlugin = {
	id: PLUGIN_ID,
	state: StateFns,
	augment: (prototype) => {
		prototype.setLogicalStack = function setLogicalStack({ module, operation }: Stack) {
			const SXC = this
			let root_state = SXC[INTERNAL_PROP]

			root_state = TopStateFns.reduce_plugin<State>(root_state, PLUGIN_ID, (state) => {
				if (module) state = StateFns.set_module(state, module)
				if (operation) state = StateFns.set_operation(state, operation)

				return state
			})

			SXC[INTERNAL_PROP] = root_state

			return SXC
		}

		prototype.getLogicalStack = function getLogicalStack() {
			const SXC = this

			return _reduceStatePathToLogicalStack(_getSXCStatePath(SXC))
		}

		prototype.getShortLogicalStack = function get_stack_end() {
			const { stack } = this[INTERNAL_PROP].plugins[PLUGIN_ID]
			return (
				LOGICAL_STACK_BEGIN_MARKER +
				stack.module +
				LOGICAL_STACK_SEPARATOR_NON_ADJACENT + //LOGICAL_STACK_SEPARATOR
				stack.operation +
				LOGICAL_STACK_OPERATION_MARKER +
				LOGICAL_STACK_END_MARKER
			)
		}

		// internal only
		// expects an already normalized error (through @monorepo-private/utils--error)
		prototype._decorateErrorWithLogicalStack = function _decorateErrorWithLogicalStack(err: XXError) {
			const SXC = this

			err._temp = err._temp || {}
			err.details = err.details || {}

			const logicalStack = {
				full: SXC.getLogicalStack(),
				short: undefined as undefined | string,
			}

			if (err._temp.SXC) {
				// OK this error is already decorated.
				// Thus the message is also already decorated, don't touch it.

				// BUT we may be able to add more info, can we?
				if (err.details.logicalStack?.includes(logicalStack.full)) {
					// ok, logical stack already chained, nothing to add
				} else {
					// SXC chain has branched, reconcile paths
					// OK maybe overkill...
					const other_path = err._temp.statePath
					const current_path = _getSXCStatePath(SXC)

					// find common path
					let last_common_index = 0
					for (let i = 1; i < current_path.length; ++i) {
						if (other_path[i] !== current_path[i]) break
						last_common_index = i
					}

					// reconcile the 2 stack traces
					let improvedStatePath = [...current_path]
					improvedStatePath.push(BRANCH_JUMP_PSEUDO_STATE)
					improvedStatePath = improvedStatePath.concat(other_path.slice(last_common_index + 1))

					err._temp.statePath = improvedStatePath
					err.details.logicalStack = _reduceStatePathToLogicalStack(improvedStatePath)
				}
			} else {
				err._temp.SXC = SXC
				err._temp.statePath = _getSXCStatePath(SXC)

				logicalStack.short = SXC.getShortLogicalStack()
				if (err.message.startsWith(logicalStack.short!)) {
					// can that happen??? It's a bug!
					/* eslint-disable no-console */
					console.warn("UNEXPECTED SXC non-decorated error already prefixed??")
					/* eslint-enable no-console */
				} else {
					const original_message = err.message
					err.message = logicalStack.short + ": " + original_message
					const expected_first_line_of_the_stack = `${err.name}: ${original_message}`
					if (err.stack?.startsWith(expected_first_line_of_the_stack))
						err.stack = `${err.name}: ${err.message}` + err.stack.slice(expected_first_line_of_the_stack.length)
				}

				err.details.logicalStack = logicalStack.full
			}

			return err
		}
	},
}

export { PLUGIN }
