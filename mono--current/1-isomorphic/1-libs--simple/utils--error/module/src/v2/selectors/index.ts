import { NotFoundError } from "../klasses/index.ts"
import { isꓽErrorShapeⳇBase } from "../types/guards.ts"

/////////////////////////////////////////////////

function getꓽname(thrown: unknown): string {
	let candidate: string = (thrown as any)?.name
	if (typeof candidate === "string") return candidate.toWellFormed().normalize("NFC")

	return "Error"
}

function getꓽmessage(thrown: unknown): string {
	let candidate: string = (thrown as any)?.message
	if (typeof candidate === "string") return candidate.toWellFormed().normalize("NFC")

	candidate = thrown as string
	if (typeof candidate === "string") return candidate.toWellFormed().normalize("NFC")

	return "Something happened!"
}

function getꓽattribute<T>(thrown: unknown, key: PropertyKey, fallback: T): T
function getꓽattribute<T = unknown>(thrown: unknown, key: PropertyKey, fallback?: never): T | undefined
function getꓽattribute<T>(thrown: unknown, key: PropertyKey, fallback: T): T | undefined {
	let candidate: T = (thrown as any)?.[key]
	if (candidate != null) {
		if (typeof candidate === "string") return candidate.toWellFormed().normalize("NFC") as T
		return candidate
	}

	return fallback
}

// is confidently close enough to an Error to be taken as one
function isꓽError(thrown: unknown): boolean {
	if (thrown instanceof Error) return true

	return isꓽErrorShapeⳇBase(thrown)
}

function isꓽErrorⵧrsrc_not_found(thrown: unknown): boolean {
	if (thrown instanceof NotFoundError) {
		return true
	}

	if (getꓽattribute<number>(thrown, "statusCode") === 404) {
		return true
	}

	// node
	if (getꓽattribute<string>(thrown, "code") === "ENOENT") {
		return true
	}

	if (getꓽmessage(thrown).toLowerCase().includes("no such file or directory")) {
		return true
	}
	if (getꓽmessage(thrown).toLowerCase().includes("not found")) {
		return true
	}

	return false
}

/////////////////////////////////////////////////

export { getꓽmessage, getꓽname, getꓽattribute, isꓽError, isꓽErrorⵧrsrc_not_found }
