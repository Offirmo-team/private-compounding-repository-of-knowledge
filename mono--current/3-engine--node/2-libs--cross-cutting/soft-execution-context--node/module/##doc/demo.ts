/////////////////////////////////////////////////

import { createLogger } from "@monorepo-private/practical-logger--node"
import {
	getRootSXC,
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from "@monorepo-private/soft-execution-context--node"

const logger = createLogger({
	name: "root",
	suggestedLevel: "silly",
})
logger.log(`Logger up.`)

getRootSXC().injectDependencies({
	logger,
	IS_VERBOSE: true,
})

getRootSXC().emitter.on("final-error", function onError({ data: { SXC, err } }) {
	// maybe report to server
	// sentry.xyz()

	// or direct to analytics
	SXC.fireAnalyticsEvent("error", {
		...err.details,
		message: err.message,
	})
})
getRootSXC().emitter.on("analytics", function onAnalyticsEvent({ data: { eventId, details } }) {
	// ex. send to server
	console.groupCollapsed(`[🕴 analytics] "${eventId}"`)
	console.log("details", details)
	console.groupEnd()
})

listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()

//import { start } from '../../../../../1-isomorphic/2-libs--cross-cutting/soft-execution-context/module/##doc/examples/app.ts'
//import { start } from '@monorepo-private/soft-execution-context/foo'
//import { start } from '@monorepo-private/soft-execution-context/_examples/app.ts'
//import { start } from '@monorepo-private/soft-execution-context/module/##doc/examples/app.ts'
//start()
