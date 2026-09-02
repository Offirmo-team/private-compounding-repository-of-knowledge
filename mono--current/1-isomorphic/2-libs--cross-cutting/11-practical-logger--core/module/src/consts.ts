import type { LogLevel } from "@monorepo-private/practical-logger--types"

export const LIB = "@monorepo-private/practical-logger--core"

// level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)
export const LOG_LEVEL_TO_INTEGER: Readonly<{ readonly [k: string]: number }> = {
	fatal: 1,
	emerg: 2,

	alert: 10,

	crit: 20,

	error: 30,

	warning: 40,
	warn: 40, // alias
	notice: 45,

	info: 50,

	verbose: 70,

	log: 80,
	debug: 81,

	trace: 90,

	silly: 100,
}

export const ALL_LOG_LEVELS: ReadonlyArray<LogLevel> = (Object.keys(LOG_LEVEL_TO_INTEGER) as LogLevel[]).sort(
	(a: LogLevel, b: LogLevel) => LOG_LEVEL_TO_INTEGER[a]! - LOG_LEVEL_TO_INTEGER[b]!,
)

// rationalization to a clear, human-understandable string
// TODO REVIEW use case
export const LOG_LEVEL_TO_HUMAN: Readonly<Record<LogLevel, string>> = ALL_LOG_LEVELS.reduce((acc, ll) => {
	acc[ll] =
		(
			{
				em: "emergency", // rare word
				wa: "warn", // dedupe
			} as any
		)[ll.slice(0, 2)] || ll
	return acc
}, {} as any)

export * from "./consts-base.ts"
