import { type LogLevel, LOG_LEVEL_TO_HUMAN } from "@monorepo-private/practical-logger--core"

export const LEVEL_TO_CONSOLE_METHOD: Readonly<Record<LogLevel, string>> = {
	fatal: "error",
	emerg: "error",
	alert: "error",
	crit: "error",

	error: "error",

	warning: "warn",
	warn: "warn",

	notice: "info",
	info: "info",
	verbose: "info",

	log: "log",

	// REMINDER
	// console.debug() needs to be ENABLED in the dev tools to be visible!
	debug: "debug",
	trace: "debug", // console.trace is NOT an output, do NOT use it
	silly: "debug",
}

const MIN_WIDTH = 5
export function to_uniform_level(level: LogLevel): string {
	let str = LOG_LEVEL_TO_HUMAN[level] //.slice(0, MIN_WIDTH)
	//if (str.length < MIN_WIDTH)
	str = (str + "         ").slice(0, MIN_WIDTH)
	return str
}
