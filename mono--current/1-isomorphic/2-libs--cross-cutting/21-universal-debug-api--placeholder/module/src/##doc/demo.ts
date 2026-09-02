import { getLogger, addDebugCommand } from "@monorepo-private/universal-debug-api--placeholder"

console.log("Nothing should be displayed below this line:")

const root_logger = getLogger()
root_logger.fatal("Hello")

const logger = getLogger({ name: "foo" })
logger.fatal("Hello")

addDebugCommand("foo", () => {})
