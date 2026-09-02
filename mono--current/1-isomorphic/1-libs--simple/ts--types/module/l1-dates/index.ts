/////////////////////////////////////////////////

export type YYYY = `2${DigitCharacter}${DigitCharacter}${DigitCharacter}`

export type MM = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"

export type DD =
	| "01"
	| "02"
	| "03"
	| "04"
	| "05"
	| "06"
	| "07"
	| "08"
	| "09"
	| `${"1" | "2"}${DigitCharacter}`
	| "30"
	| "31"

// too complex to represent
//export type YYYYᝍMMᝍDD = `${YYYY}-${MM}-${DD}`
export type YYYYᝍMMᝍDD = `${string}-${string}-${string}`

/////////////////////////////////////////////////

import type { DigitCharacter } from "type-fest"
