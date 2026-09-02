console.log("Demo starting...")

//import nearest_pkg from '~/package.json'

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

const logger = createLogger({
	name: "demo",
	suggestedLevel: "silly",
})

logger.log("hello world!")
logger.info("hello world!")

demo_legacy_console()

demo_logger_api(createLogger)
demo_logger_basic_usage(logger)
demo_logger_levels(logger)

demo_error(console as any)
demo_error(logger)

demo_group(logger)
demo_incorrect_logger_invocations(logger)
demo_devtools_fonts()
