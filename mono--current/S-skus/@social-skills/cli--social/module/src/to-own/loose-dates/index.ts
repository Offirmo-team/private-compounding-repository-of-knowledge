/* PROMPT
 * ’
 */

import assert from "@monorepo-private/assert/v1"
import type { Immutable } from "@monorepo-private/ts--types"
import { isꓽexact_stringified_number } from "@monorepo-private/type-detection"

/////////////////////////////////////////////////

interface LooseDate {
	YYYY?: number
	MM?: number
	DD?: number
}

function createⵧfrom_str(raw: string): LooseDate {
	assert(raw.length, `LD empty string!`)

	const [RYYYY, RMM, RDD] = raw.split("/")

	const YYYY: LooseDate["YYYY"] = (() => {
		if (!RYYYY) return undefined

		assert(isꓽexact_stringified_number(RYYYY), `YYYY format issue! "${RYYYY}"`)
		return parseInt(RYYYY, 10)
	})()

	const MM: LooseDate["MM"] = (() => {
		if (!RMM) return undefined

		//assert(isꓽexact_stringified_number(RMM), `MM format issue! "${RMM}"`)
		return parseInt(RMM, 10)
	})()

	const DD: LooseDate["DD"] = (() => {
		if (!RDD) return undefined

		//assert(isꓽexact_stringified_number(RDD), `RD format issue! "${RDD}"`)
		return parseInt(RDD, 10)
	})()

	assert(YYYY || MM, `LD format issue! "${raw}"`) // can't have just DD
	assert(!YYYY || MM, `LD format issue! "${raw}"`) // can't have YYYY//DD

	return {
		...(YYYY && { YYYY }),
		...(MM && { MM }),
		...(DD && { DD }),
	}
}

function isꓽpart(c: string): boolean {
	return "0123456789/".includes(c)
}

function getꓽPlainDateIso(loose_date: Immutable<LooseDate>): string {
	assert(loose_date.YYYY, `get_plain_date_iso: no YYYY!`)
	const YYYY = String(loose_date.YYYY).padStart(4, "0")
	const MM = String(loose_date.MM || 1).padStart(2, "0")
	const DD = String(loose_date.DD || 1).padStart(2, "0")
	return `${YYYY}-${MM}-${DD}`
}

/////////////////////////////////////////////////

export { type LooseDate, createⵧfrom_str, isꓽpart, getꓽPlainDateIso }
