import { assert } from "./embedded-deps/assert/index.ts"
import type { Seed, Int32 } from "./types.ts"

/////////////////////////////////////////////////

function _toꓽInt32Arrayⵧarray(arr: Int32[]): Int32Array {
	assert(
		arr.every((i) => typeof i === "number"),
		`array should be array of number!`,
	)
	// TODO check Int32

	return new Int32Array(arr.length).map((_, i) => arr[i]!)
}

/* js string (ucs-2/utf16) to a 32-bit integer (utf-8 chars, little-endian) array */
function _toꓽInt32Arrayⵧstring(s: string): Int32Array {
	const result: Int32[] = []
	s = s + "\0\0\0" // pad string to avoid discarding last chars
	const l = s.length - 1

	let i = 0
	let r4 = []
	while (i < l) {
		const w1 = s.charCodeAt(i++)
		const w2 = s.charCodeAt(i + 1)
		if (w1 < 0x0080) {
			// 0x0000 - 0x007f code point: basic ascii
			r4.push(w1)
		} else if (w1 < 0x0800) {
			// 0x0080 - 0x07ff code point
			r4.push(((w1 >>> 6) & 0x1f) | 0xc0)
			r4.push(((w1 >>> 0) & 0x3f) | 0x80)
		} else if ((w1 & 0xf800) != 0xd800) {
			// 0x0800 - 0xd7ff / 0xe000 - 0xffff code point
			r4.push(((w1 >>> 12) & 0x0f) | 0xe0)
			r4.push(((w1 >>> 6) & 0x3f) | 0x80)
			r4.push(((w1 >>> 0) & 0x3f) | 0x80)
		} else if ((w1 & 0xfc00) == 0xd800 && (w2 & 0xfc00) == 0xdc00) {
			// 0xd800 - 0xdfff surrogate / 0x10ffff - 0x10000 code point
			const u = ((w2 & 0x3f) | ((w1 & 0x3f) << 10)) + 0x10000
			r4.push(((u >>> 18) & 0x07) | 0xf0)
			r4.push(((u >>> 12) & 0x3f) | 0x80)
			r4.push(((u >>> 6) & 0x3f) | 0x80)
			r4.push(((u >>> 0) & 0x3f) | 0x80)
			i++
		} else {
			// invalid char
			throw new Error("unexpected char!")
		}

		/* add integer (four utf-8 value) to array */
		if (r4.length >= 4) {
			// little endian
			result.push((r4.shift()! << 0) | (r4.shift()! << 8) | (r4.shift()! << 16) | (r4.shift()! << 24))
		}
	}

	return _toꓽInt32Arrayⵧarray(result)
}

function getꓽseed‿Int32Array(raw_seed: Seed | Int32Array): Int32Array {
	let normalized_seed = ((): Int32Array => {
		if (typeof raw_seed === "string") {
			assert(raw_seed.length > 0, `seed as string should not be empty!`)
			return _toꓽInt32Arrayⵧstring(raw_seed)
		}

		if (typeof raw_seed === "number") {
			// TODO check format?
			return new Int32Array(1).fill(raw_seed)
		}

		if (Array.isArray(raw_seed)) {
			return _toꓽInt32Arrayⵧarray(raw_seed as Array<number>)
		}

		assert((raw_seed as any)?.BYTES_PER_ELEMENT === 4, `_seed: wrong TypeArray type!`)
		return raw_seed as any
	})()

	// result should be an Int32Array
	assert(normalized_seed.BYTES_PER_ELEMENT === 4, `_seed: wrong param type!`)
	assert(
		normalized_seed.every((i) => typeof i === "number"),
		`seed: array should be array of numbers!`,
	)

	return normalized_seed
}

///////

export { getꓽseed‿Int32Array }
