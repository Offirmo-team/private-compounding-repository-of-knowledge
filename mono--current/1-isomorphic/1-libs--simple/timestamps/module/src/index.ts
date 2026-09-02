/* set of functions generating various timestamps as strings,
 * using either convenient or standardized formats.
 * the generators can optionally take the time as param or default to current time.
 */

/////////////////////////////////////////////////

// ex. 1542780045627
export type TimestampUTCMs = number
export function getꓽUTC_timestamp‿ms(now: Readonly<Date> = new Date()): TimestampUTCMs {
	return +now
}

/////////////////////////////////////////////////
// human readable timestamps
// spec:
// - human readable
// - as short as possible

// ex. 20181121
// assumed side effect of being castable to a number with a sort property older < newer
export type HumanReadableTimestampUTCDays = string
export function getꓽUTC_timestampⵧhuman_readable‿days(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCDays {
	const YYYY = now.getUTCFullYear()
	const MM = String(now.getUTCMonth() + 1).padStart(2, "0")
	const DD = String(now.getUTCDate()).padStart(2, "0")

	return `${YYYY}${MM}${DD}`
}

// ex. 20181121_06h00
export type HumanReadableTimestampUTCMinutes = string //`${HumanReadableTimestampUTCDays}_${string}h${string}`
export function getꓽUTC_timestampⵧhuman_readable‿minutes(
	now: Readonly<Date> = new Date(),
): HumanReadableTimestampUTCMinutes {
	const hh = String(now.getUTCHours()).padStart(2, "0")
	const mm = String(now.getUTCMinutes()).padStart(2, "0")

	return getꓽUTC_timestampⵧhuman_readable‿days(now) + `_${hh}h${mm}`
}

// ex. 20190608_04h23m15
export type HumanReadableTimestampUTCSeconds = string //`${HumanReadableTimestampUTCMinutes}m${string}`
export function getꓽUTC_timestampⵧhuman_readable‿seconds(
	now: Readonly<Date> = new Date(),
): HumanReadableTimestampUTCSeconds {
	const ss = String(now.getUTCSeconds()).padStart(2, "0")

	return getꓽUTC_timestampⵧhuman_readable‿minutes(now) + `m${ss}`
}

// ex.      20181121_06h00m45s632
// formerly 20181121_06h00+45.632
export type HumanReadableTimestampUTCMs = string //`${HumanReadableTimestampUTCSeconds}s${string}`
export function getꓽUTC_timestampⵧhuman_readable‿ms(now: Readonly<Date> = new Date()): HumanReadableTimestampUTCMs {
	const mmm = String(now.getUTCMilliseconds()).padStart(3, "0")

	return getꓽUTC_timestampⵧhuman_readable‿seconds(now) + `s${mmm}`
}

/////////////////////

// ISO 8601 Extended Format. The format is as follows: YYYY-MM-DDTHH:mm:ss.sssZ
// https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
// ex. 2024-03-21T21:45:08.686Z
export type ISO8601TimestampMs = string
export function getꓽISO8601ⵧextended‿ms(now: Readonly<Date> = new Date()): ISO8601TimestampMs {
	return now.toISOString()
}

// ex. 2024-03-21T21:45
export type ISO8601TimestampSimplifiedMin = string
export function getꓽISO8601ⵧsimplified‿minutes(now: Readonly<Date> = new Date()): ISO8601TimestampSimplifiedMin {
	return getꓽISO8601ⵧextended‿ms(now).slice(0, 16)
}

// ex. 2024-03-21
// ex. https://developers.cloudflare.com/workers/configuration/compatibility-dates/
export type ISO8601TimestampSimplifiedDays = string
export function getꓽISO8601ⵧsimplified‿days(now: Readonly<Date> = new Date()): ISO8601TimestampSimplifiedDays {
	return getꓽISO8601ⵧextended‿ms(now).slice(0, 10)
}

/////////////////////////////////////////////////

// fun but unclear
// https://space.stackexchange.com/questions/36628/utc-timestamp-format-for-launch-vehicles
/*function getꓽspace_timestamp_ms(now: Readonly<Date> = new Date()): string {
	const YYYY = now.getUTCFullYear()
	const MM = now.getUTCMonth()
	const DD = ('0' + now.getUTCDate()).slice(-2)
	const hh = ('0' + now.getUTCHours()).slice(-2)
	const mm = ('0' + now.getUTCMinutes()).slice(-2)
	const ss = ('0' + now.getUTCSeconds()).slice(-2)
	const mmm = ('00' + now.getUTCMilliseconds()).slice(-3)

	return `${DD} ${hh}:${mm}:${ss}.${mmm}`
}*/

/////////////////////////////////////////////////

export const TEST_TIMESTAMP_MS = 1234567890 // useful for unit tests
