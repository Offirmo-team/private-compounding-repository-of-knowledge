/* runtime type detection of some DOM related types
 */

/////////////////////////////////////////////////

// TODO usage?
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
export function isꓽEventTarget(x: any): x is EventTarget {
	if (typeof x?.addEventListener !== "function") return false

	if (typeof x?.removeEventListener !== "function") return false

	if (typeof x?.dispatchEvent !== "function") return false

	return true
}

/////////////////////////////////////////////////
