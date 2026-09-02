import * as Bowser from "bowser"

import { type BaseInjections, type SoftExecutionContext, getRootSXC } from "@monorepo-private/soft-execution-context"
//import ensureDeviceUUID from '@monorepo-private/ensure-device-uuid-browser'

import { LS_KEYS } from "./consts.ts"

/////////////////////////////////////////////////

// XXX redundant, next one is better (?rly)
// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
/*
function listenToErrors() {
	const SXC = getRootSXC()

	window.onerror = function (msg, url, line, colno, err) {
		console.log('DEBUG', arguments)
		err = err || new Error(`Error "${msg}" from "${url}", line ${line}!`)

		SXC.handleError(...{
			SXC,
			debugId: 'browser/onError',
			shouldRethrow: false,
		}, err)

		return true // same as preventDefault XXX should we?
	}
}
*/

function listenToErrorEvents(): void {
	const SXC = getRootSXC().createChild().setLogicalStack({ operation: "(browser/on error event)" })

	SXC.xTry("SXC/browser/listenToErrorEvents", ({ logger }) => {
		window.addEventListener("error", function (evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
			//console.log('DEBUG SXC browser debug: error event', arguments)
			const err =
				evt && evt.message === "Script error."
					? new Error("Unreadable error from another origin!")
					: evt.error ||
						new Error(`Error "${evt.message}" from "${evt.filename}", line ${evt.lineno}.${evt.colno}!`)

			SXC.handleError(err, "browser/onError")

			//evt.preventDefault() // XXX should we?
		})

		logger.debug("Root SXC is now listening to error events ✔")
	})
}

function listenToUnhandledRejections(): void {
	const SXC = getRootSXC().createChild().setLogicalStack({ operation: "(browser/unhandled rejection)" })

	SXC.xTry("SXC/browser/listenToUnhandledRejections", ({ logger }) => {
		//window.onunhandledrejection = function(evt) {
		window.addEventListener("unhandledrejection", function (evt) {
			// https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
			//console.log('DEBUG SXC browser debug: onunhandledrejection', arguments)
			//console.log(evt.reason)
			const err = evt.reason || new Error("Error: uncaught promise rejection!")

			SXC.handleError(err, "browser/unhandled rejection")
		})

		logger.debug("Root SXC is now listening to unhandled rejection events ✔")
	})
}

interface BrowserDetails {
	OS_NAME: string
	OS_RELEASE: string
	BROWSER_NAME: string
	BROWSER_VERSION: string
	DEVICE_TYPE: string
}

function decorateWithDetectedEnv<Injections, AnalyticsDetails, ErrorDetails>(
	SXC: SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>,
): void {
	SXC = SXC || getRootSXC()

	const injections: Partial<BaseInjections> = {
		IS_DEV_MODE: localStorage.getItem(LS_KEYS.dev_mode) === "true",
		IS_VERBOSE: localStorage.getItem(LS_KEYS.verbose) === "true",
	}

	// @ts-expect-error  TODO understand and fix error
	SXC.injectDependencies(injections)

	const browser = Bowser.getParser(window.navigator.userAgent)
	const details: BrowserDetails = {
		//DEVICE_UUID: ensureDeviceUUID(), TODO reevaluate the need
		// TODO normalize browser/os detection!
		OS_NAME: browser.getOSName(),
		OS_RELEASE: browser.getOSVersion(),
		BROWSER_NAME: browser.getBrowserName(),
		BROWSER_VERSION: browser.getBrowserVersion() || "unknown",
		DEVICE_TYPE: browser.getPlatformType(),
	}

	// @ts-expect-error  TODO type properly
	SXC.setAnalyticsAndErrorDetails(details)
	//logger.debug('Root SXC is now decorated with env infos ✔', { Bowser: browser.getResult(), details: SXC.getAnalyticsDetails() })
}

/////////////////////////////////////////////////

export * from "@monorepo-private/soft-execution-context"
export { listenToErrorEvents, listenToUnhandledRejections, decorateWithDetectedEnv }
