import type { SoftExecutionContext } from "@monorepo-private/soft-execution-context"

const STYLES = "padding: .5em; background-color: red; color: white; font-weight: bold;"

async function init(): Promise<void> {
	function on_error(err: unknown, src: string) {
		try {
			// this code must be super extra safe!!!
			// don't even use the advanced logger!
			console.group("%con_error()", STYLES)

			console.error(err)
			console.error({ err })

			/*
			// ignore some
			if (err.message === 'the-boring-rpg›(browser/on error event): Failed to execute \'removeChild\' on \'Node\': The node to be removed is not a child of this node.') {
				logger.info('(↑ error in the ignore list)')
				return
			}*/

			console.groupEnd()
		} catch (err2) {
			console.log(`%c RECURSIVE CRASH!!! SXC ERROR HANDLING CAN ABSOLUTELY NOT CRASH!!! FIX THIS!!!`, STYLES)
			console.log(err2)
		}
	}

	try {
		// x@ts-expect-error during monorepo resurrection, the package below may not yet be available
		const { getRootSXC, listenToErrorEvents, listenToUnhandledRejections } =
			await import("@monorepo-private/soft-execution-context--browser")

		const rootSXC: SoftExecutionContext = getRootSXC()
		rootSXC.emitter.on("final-error", ({ data: { err } }) => {
			on_error(err, "SXC/final-error")
		})
		listenToErrorEvents()
		listenToUnhandledRejections()
		rootSXC.xTry("init:SXC", ({ logger, SXC }) => {
			logger.debug("Root SXC is now decorated with error details ✔", SXC.getErrorDetails())
		})
	} catch (err: any) {
		if (!err?.message?.includes?.("not yet resurrected")) throw err

		window.addEventListener("error", function (evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
			//console.log('DEBUG SXC browser debug: error event', arguments)
			const err =
				evt && evt.message === "Script error."
					? new Error("Unreadable error from another origin!")
					: evt.error ||
						new Error(`Error "${evt.message}" from "${evt.filename}", line ${evt.lineno}.${evt.colno}!`)

			on_error(err, "browser/onError")

			//evt.preventDefault() // XXX should we?
		})

		window.addEventListener("unhandledrejection", function (evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
			//console.log('DEBUG SXC browser debug: onunhandledrejection', arguments)
			//console.log(evt.reason)
			const err = evt.reason || new Error("Error: uncaught promise rejection!")

			on_error(err, "browser/unhandled rejection")
		})
	}
}

/////////////////////////////////////////////////

export default init
