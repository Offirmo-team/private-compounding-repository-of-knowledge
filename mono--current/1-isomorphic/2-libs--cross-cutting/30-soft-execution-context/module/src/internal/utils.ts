import type { SoftExecutionContext } from "../types.ts"

import { INTERNAL_PROP } from "./consts.ts"
import type { InternalSXC, InternalSXCState } from "./types.ts"

/////////////////////////////////////////////////

/* flatten an object with a prototype chain
 * into a plain object
 */
function flattenOwnAndInheritedProps(object: Record<string, unknown>): Record<string, unknown> {
	if (!object) /* return object */ throw new Error(`SXC Unexpected case F1!`)
	if (Array.isArray(object)) /*return object */ throw new Error(`SXC Unexpected case F2!`)
	if (typeof object !== "object") /* return object */ throw new Error(`SXC Unexpected case F3!`)

	const res = Object.create(null)

	for (const property in object) {
		res[property] = object[property]
	}

	return res
}

/////////////////////////////////////////////////

function _isSXC(SXC: any): SXC is InternalSXC {
	return SXC && SXC[INTERNAL_PROP]
}

function getInternalSXC(SXC: any): InternalSXC {
	if (!_isSXC(SXC)) throw new Error(`Unexpected non SXC passed around!`)

	return SXC
}

// needed for various tree traversal algorithms
function _getSXCStatePath(SXC: SoftExecutionContext): InternalSXCState[] {
	const _SXC = getInternalSXC(SXC)

	if (!_SXC[INTERNAL_PROP].cache.statePath) {
		const path = []
		let state: InternalSXCState | undefined = _SXC[INTERNAL_PROP]

		while (state) {
			path.unshift(state)
			state = state.parent
		}

		_SXC[INTERNAL_PROP].cache.statePath = path
	}

	return _SXC[INTERNAL_PROP].cache.statePath
}

/////////////////////////////////////////////////

export { flattenOwnAndInheritedProps, _getSXCStatePath }
