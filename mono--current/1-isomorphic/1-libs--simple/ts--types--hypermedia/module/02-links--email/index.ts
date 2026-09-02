/* TypeScript types useful when manipulating email related data
 */

/////////////////////////////////////////////////

export type Email‿str = string

export function isꓽEmail‿str(possible_email: string): possible_email is Email‿str {
	return _validateꓽhas_email_structure(possible_email) === null
}

export function assertꓽEmail‿str(possible_email: string): asserts possible_email is Email‿str {
	const err = _validateꓽhas_email_structure(possible_email)
	if (err) throw err
}

function _validateꓽhas_email_structure(possible_email: string): Error | null {
	const split = possible_email.split("@")
	if (split.length < 2) return new Error("Invalid email: no @!")
	if (split.length > 2) return new Error("Invalid email: more than one @!")

	const [before, after] = split as [string, string]

	if (after.split(".").length < 2) return new Error("Invalid email: bad domain!")
	if (!before.length || !after.length) return new Error("Invalid email: bad structure!")

	return null
}

/////////////////////////////////////////////////
