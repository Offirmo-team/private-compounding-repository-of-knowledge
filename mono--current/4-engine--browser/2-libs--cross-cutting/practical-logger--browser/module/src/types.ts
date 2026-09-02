import type { BaseSinkOptions } from "@monorepo-private/practical-logger--types"

export type Browser = "firefox" | "safari" | "chromium" | "unknown"

export interface SinkOptions extends BaseSinkOptions {
	useCss?: boolean
	betterGroups?: boolean
	explicitBrowser?: Browser
}
