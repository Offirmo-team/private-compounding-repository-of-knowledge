import { demo_logger_api } from "@monorepo-private/practical-logger--core/__shared-demos"
import {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,
} from "@monorepo-private/universal-debug-api--placeholder"

console.log("Nothing should be displayed below this line:")

const root_logger = getLogger()
root_logger.fatal("Hello")

const logger = getLogger({ name: "foo" })
logger.fatal("Hello")

addDebugCommand("foo", () => {})

addDebugCommand("demo_logger", demo_logger_api)

exposeInternal("foo.bar.baz", 42)

console.log("some value =", overrideHook("some-value", "some default"))
