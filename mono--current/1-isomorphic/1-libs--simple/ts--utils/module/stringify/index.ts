import { hasꓽcontent, isꓽnegative_zero, isꓽcontainer } from "@monorepo-private/type-detection"

/////////////////////////////////////////////////

// slightly better than String()
function toꓽstring(x: any): string {
	if (typeof x === "string") return `"${x}"`

	if (isꓽnegative_zero(x)) return "-0"

	if (isꓽcontainer(x)) {
		if (!hasꓽcontent(x)) {
			return Array.isArray(x) ? "[]" : "{}"
		}

		if (Array.isArray(x)) {
			if (x.every((e) => !isꓽcontainer(e as any))) {
				return "[" + x.map(toꓽstring).join(",") + "]"
			}
			return `[…(${x.length} items)]`
		}

		const entries = Object.entries(x)
		return `{…(${entries.length} props)}`
	}

	return String(x)
}

/////////////////////////////////////////////////

export { toꓽstring }
