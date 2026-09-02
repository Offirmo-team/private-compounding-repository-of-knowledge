import type { LogSink } from "@monorepo-private/practical-logger--types"

import type { Browser, SinkOptions } from "../types.ts"

import sink_chromium from "./advanced/chromium.ts"
import sink_firefox from "./advanced/firefox.ts"
import sink_safari from "./advanced/safari.ts"
import create_sink_no_css from "./sink--no-css.ts"

// TODO export that?
function quick_detect_browser(): Browser {
	// https://stackoverflow.com/a/9851769/587407
	// https://dev.to/_elmahdim/safe-reliable-browser-sniffing-39bp

	try {
		const window = globalThis as any

		// 2024/12/12 = null for FF, undef for Chrome and Safari
		if (window?.InstallTrigger !== undefined) return "firefox"

		// 2024/12/12 ✅
		if (window?.ApplePaySession) return "safari"

		// 2024/12/12 ✅
		if (window?.chrome) return "chromium"
	} catch {
		/* ignore */
	}

	return "unknown"
}

export function create(options: Readonly<SinkOptions> = {}): LogSink {
	if (options.useCss === false) return create_sink_no_css(options)

	switch (options.explicitBrowser || quick_detect_browser()) {
		case "firefox":
			return sink_firefox
		case "safari":
			return sink_safari
		case "chromium":
			return sink_chromium
		default:
			return create_sink_no_css(options)
	}
}
