import * as jsondiffpatch from "jsondiffpatch"
import type { DiffPatcher } from "jsondiffpatch"

// TODO use a validating stringifier!

/////////////////////////////////////////////////

function _is_valid_uuid(uuid: unknown): uuid is string {
	// XXX TODO where does this comes from??? We should have a lib!
	return typeof uuid === "string" && uuid.startsWith("uu1") && uuid.length === 24
}

const _raw_comparator = jsondiffpatch.create({
	cloneDiffValues: true /* default false. if true, values in the obtained delta will be cloned
      (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects.
      This becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
      instead of true, a function can be specified here to provide a custom clone(value)
      */,
})
const get_raw_diff: DiffPatcher["diff"] = _raw_comparator.diff.bind(_raw_comparator)

const _advanced_comparator = jsondiffpatch.create({
	// used to match objects when diffing arrays, by default only === operator is used
	objectHash: function (obj) {
		return JSON.stringify(obj)
	},

	// this optional function can be specified to ignore object properties (eg. volatile data)
	// name: property name, present in either context.left or context.right objects
	// context: the diff context (has context.left and context.right objects)
	propertyFilter: function (name: string, context: any /* DiffContext */) {
		if (name === "uuid") {
			if (!_is_valid_uuid(context.right.uuid)) throw new Error(`Invalid UUID format! ("${context.right.uuid}")`)
			if (!_is_valid_uuid(context.left.uuid)) throw new Error(`Invalid UUID format! ("${context.left.uuid}")`)

			// ignore
			return false
		}

		return true
	},

	cloneDiffValues: true /* default false. if true, values in the obtained delta will be cloned
      (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects.
      This becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
      instead of true, a function can be specified here to provide a custom clone(value)
      */,
})
const get_advanced_diff: DiffPatcher["diff"] = _advanced_comparator.diff.bind(_advanced_comparator)

/////////////////////////////////////////////////

export { get_raw_diff, get_advanced_diff }
