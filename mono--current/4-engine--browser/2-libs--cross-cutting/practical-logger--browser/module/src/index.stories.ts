import { createLogger } from "@monorepo-private/practical-logger--browser"
import {
	demo_legacy_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_error,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
} from "@monorepo-private/practical-logger--core/__shared-demos"

/////////////////////////////////////////////////

const name = "demo"
const suggestedLevel = "silly"

const logger = createLogger({ name, suggestedLevel })

/////////////////////////////////////////////////

export function Overall() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_logger_api(createLogger)
	}, 100)

	return "Look at the console!"
}

export function Legacy() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_legacy_console()
	}, 100)

	return "Look at the console!"
}

export function Levels() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_logger_levels(logger)
		demo_legacy_console()
	}, 100)

	return "Look at the console!"
}

export function Basic() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_logger_basic_usage(logger)
	}, 100)

	return "Look at the console!"
}

export function Errors() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_error(logger)
	}, 100)

	return "Look at the console!"
}

export function Group() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_group(logger)
	}, 100)

	return "Look at the console! (should feature auto-uncollapse"
}

export function IncorrectInvocations() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_incorrect_logger_invocations(logger)
	}, 100)

	return "Look at the console!"
}

export function DevtoolsFonts() {
	setTimeout(() => {
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
		demo_devtools_fonts()
	}, 100)

	return "Look at the console!"
}
