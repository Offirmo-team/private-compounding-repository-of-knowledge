import * as os from "node:os"

import { getRootSXC } from "@monorepo-private/soft-execution-context"

/////////////////////

// TODO protect from double install

function listenToUncaughtErrors() {
	const SXC = getRootSXC().createChild().setLogicalStack({ operation: "(node/uncaught)" })

	process.on("uncaughtException", (err) => {
		SXC.handleError(err, "node/uncaught")
	})
}

function listenToUnhandledRejections() {
	const SXC = getRootSXC().createChild().setLogicalStack({ operation: "(node/unhandled rejection)" })

	process.on("unhandledRejection", (err) => {
		SXC.handleError(err, "node/unhandled rejection")
	})
}

function decorateWithDetectedEnv() {
	const SXC = getRootSXC()

	// TODO normalize browser/os detection
	const details = {
		...(globalThis.process && { node_version: globalThis.process?.versions?.node }),
		os_platform: os.platform(),
		os_release: os.release(),
		os_type: os.type(),
	}

	SXC.setAnalyticsAndErrorDetails(details)
}

// for unit tests only, for convenience
/*function _force_set_level_of_uda_default_logger(suggestedLevel: string) {
	let logger = getRootSXC().getInjectedDependencies().logger // can be console or UDA
	if (!logger.setLevel) {
		try {
			try {
				const { getLogger } = require('@monorepo-private/universal-debug-api--node')
				logger = getLogger({ suggestedLevel })
			}
			catch {
				//const { getLogger } = require('../../universal-debug-api-node')
				//logger = getLogger({ suggestedLevel })
			}
			getRootSXC().injectDependencies({ logger })
		} catch {}
	}

	try {
		logger.setLevel(suggestedLevel)
	}
	catch {
		logger.warn('Couldn’t force an UDA logger with given level!')
	}
}*/

/////////////////////

export * from "@monorepo-private/soft-execution-context"
export {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
	//_force_set_level_of_uda_default_logger, // for convenience, especially unit tests
}
