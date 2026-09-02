/////////////////////////////////////////////////

function getꓽmessage(thrown: unknown): string {
	let candidate: string = (thrown as any)?.message
	if (typeof candidate === "string") return candidate

	candidate = thrown as string
	if (typeof candidate === "string") return candidate

	return "Something happened!"
}

function getꓽname(thrown: unknown): string {
	let candidate: string = (thrown as any)?.name
	if (typeof candidate === "string") return candidate

	return "Error"
}

/////////////////////////////////////////////////

export { getꓽmessage, getꓽname }
