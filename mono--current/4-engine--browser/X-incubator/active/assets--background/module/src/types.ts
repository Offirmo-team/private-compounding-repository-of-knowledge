/////////////////////////////////////////////////

export interface Background {
	asset: Asset

	// important, hard to compute later
	width: number
	height: number

	// when the view is "portrait", which % of the image should be ~centered?
	focusesⵧhorizontal?: Percentage[]

	// when the view is "landscape", which % of the image should be ~centered?
	focusesⵧvertical?: Percentage[]

	// TODO max resolution
}

/////////////////////////////////////////////////

import { type Asset } from "@monorepo-private/credits"
import type { Percentage } from "@monorepo-private/ts--types"
