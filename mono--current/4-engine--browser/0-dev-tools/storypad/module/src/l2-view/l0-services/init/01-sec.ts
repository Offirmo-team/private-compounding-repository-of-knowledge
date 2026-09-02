import type { SoftExecutionContext } from "@monorepo-private/soft-execution-context"

import { LIB } from "../../../consts.ts"
import { getꓽlogger } from "../logger.ts"

/////////////////////////////////////////////////

async function init(): Promise<void> {
	try {
		// x@ts-expect-error during monorepo resurrection, the package below may not yet be available
		const { getRootSXC, decorateWithDetectedEnv } = await import("@monorepo-private/soft-execution-context--browser")

		const rootSXC: SoftExecutionContext = getRootSXC()

		decorateWithDetectedEnv(rootSXC)

		rootSXC.setLogicalStack({ module: LIB })

		rootSXC.injectDependencies({
			logger: getꓽlogger(),
		})

		rootSXC.setAnalyticsAndErrorDetails({})

		rootSXC.xTry("init:SXC", ({ logger, SXC }) => {
			logger.debug("Root Soft Execution Context initialized.", rootSXC)
			logger.debug("Root SXC is now decorated with a logger ✔")
			logger.debug("Root SXC is now decorated with env infos ✔", SXC.getAnalyticsDetails())
		})
	} catch (err: any) {
		if (!err?.message?.includes?.("not yet resurrected")) throw err
	}
}

/////////////////////////////////////////////////

export default init
