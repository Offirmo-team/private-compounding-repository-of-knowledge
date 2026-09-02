import type { ErrorShapeⳇBase } from "./types.ts"

/////////////////////////////////////////////////

function isꓽErrorShapeⳇBase(x: unknown): x is ErrorShapeⳇBase {
	if (typeof (x as any)?.name !== "string") return false
	if (typeof (x as any)?.message !== "string") return false

	return true
}

/////////////////////////////////////////////////

export { isꓽErrorShapeⳇBase }
