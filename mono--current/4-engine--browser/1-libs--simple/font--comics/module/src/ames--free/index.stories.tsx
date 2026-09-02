import {
	Normalization as _Norm,
	DemoꓽAll,
} from "@monorepo-private/storypad/src/__shared/stories/css/typography/index.stories.ts"

import { All } from "../__shared/use-cases.stories"

import "./index.css"

const KLASS = "omr⋄font⁚Ames--free"

export function FontDemoⵧraw() {
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

export function FontDemoⵧCalibrated() {
	return `
<div class="${KLASS}">
${DemoꓽAll()}
</div>
	`
}

export function UseCases() {
	return `
<div class="${KLASS}">
${All()}
</div>
	`
}
