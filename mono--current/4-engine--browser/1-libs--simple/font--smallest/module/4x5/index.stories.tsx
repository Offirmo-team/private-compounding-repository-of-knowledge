import {
	Normalization as _Norm,
	DemoꓽAll,
} from "@monorepo-private/storypad/src/__shared/stories/css/typography/index.stories.ts"

import { All } from "../__shared/use-cases.stories"

import { CSS_CLASS as KLASS } from "./index.tsx"

export function UseCases() {
	return `
<div class="${KLASS}">
${All()}
</div>
	`
}

export function GenericFontDemoⵧCalibrated() {
	return `
<div class="${KLASS}">
${DemoꓽAll()}
</div>
	`
}

export function GenericFontDemoⵧraw() {
	return `
<div class="${KLASS}--raw">
${DemoꓽAll()}
</div>
	`
}

export function Calibration() {
	return `
<div class="${KLASS}">
${_Norm()}
</div>
	`
}
