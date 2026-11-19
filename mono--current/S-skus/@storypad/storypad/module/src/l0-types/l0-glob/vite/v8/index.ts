import type { GlobLeave, GlobLeaveⳇAsync } from "../../types.ts"

/////////////////////////////////////////////////

export interface Glob‿Vitev8 {
	// Modules are indexed by their file path
	[k: string]: GlobLeaveⳇAsync // depending on { eager: true | false } but we ALWAYS use eager: false
}

export function isꓽGlob‿Vitev8(x: any): x is Glob‿Vitev8 {
	const keys = Object.keys(x)

	if (!keys.some((key) => ["js", "jsx", "ts", "tsx"].some((ext) => key.endsWith(`.${ext}`)))) return false

	return keys.length >= 0
}
