/**
 * IF NOT PRESENT Add fake inset to the viewport to simulate a notch and/or a bottom bar. Useful for TESTING, should not
 * happen in prod!
 */

/////////////////////////////////////////////////
const DEBUG = false

const CORNER‿px = 40
const CORNER = `${CORNER‿px}px`
const NOTCH_HEIGHT = `${CORNER‿px * 0.9}px`
const NOTCH_BORDER_RADIUS = `${CORNER‿px * 0.9 * 0.75}px`
const NAME = "<FakeInset>"

// Important
// should be inserted high in the chain since using o⋄full-viewport
export function FakeInset() {
	return (
		<Suspense fallback={null}>
			<FakeInsetⵧloaded />
		</Suspense>
	)
}
export default FakeInset

/////////////////////////////////////////////////

function FakeInsetⵧloaded() {
	// viewport sizing is not always available before the page is loaded
	use(ೱᐧpage_loaded)
	DEBUG && console.log(`${NAME} render...`)

	const hasꓽgeometry_css_vars = use(getꓽೱᐧhasꓽgeometry_css_vars())
	if (!hasꓽgeometry_css_vars) {
		DEBUG &&
			console.log(`${NAME} bailing out: missing geometry CSS vars (usually provided by the Offirmo CSS framework)`)
		return null
	}

	const { hasꓽinset, hasꓽfold, hasꓽtitlebar } = getꓽscreen_geometry()
	// hasꓽtitlebar means it's intentionally desktop with titlebar activated = we don't want to fake an inset
	if (hasꓽinset || hasꓽfold || hasꓽtitlebar) {
		DEBUG && console.log(`🖼️ ${NAME} bailing out: screen already has funny geometry.`)
		return null
	}

	return <FakeInsetⵧoverlay />
}

function FakeInsetⵧoverlay() {
	useEffect(() => {
		console.log(`🖼️ ${NAME}: plain rectangular viewport detected => faking an inset`)

		// TODO 1 D better fake one depending on the device orientation
		const { style } = document.documentElement
		style.setProperty("--safe-area-inset-top", "47px") // iPhone 14
		style.setProperty("--safe-area-inset-bottom", "34px") // iPhone 14

		return () => {
			style.removeProperty("--safe-area-inset-top")
			style.removeProperty("--safe-area-inset-bottom")
		}
	}, [])

	return (
		<div debug-id={NAME} key={NAME} className={"o⋄full-viewport"} style={{ pointerEvents: "none" }}>
			<div
				key="notch"
				className={"debug"}
				style={{
					pointerEvents: "auto",
					position: "absolute",
					top: 0,
					left: "30%",
					width: "40%",
					height: NOTCH_HEIGHT,
					backgroundColor: "black",
					textAlign: "center",
					color: "rgba(255, 255, 255, .2)",
					borderRadius: `0 0 ${NOTCH_BORDER_RADIUS} ${NOTCH_BORDER_RADIUS}`,
				}}
			></div>

			<div
				key="bottom"
				className={"debug"}
				style={{
					pointerEvents: "auto",
					position: "absolute",
					bottom: "10px",
					left: "30%",
					width: "40%",
					height: "6px",
					backgroundColor: "black",
					borderRadius: "3px",
				}}
			></div>

			<div
				key="corner--tl"
				className={"debug"}
				style={{
					pointerEvents: "auto",
					position: "absolute",
					top: 0,
					left: 0,
					width: CORNER,
					height: CORNER,
					borderTopLeftRadius: CORNER,
					backgroundColor: "transparent",
					boxShadow: `-${CORNER} -${CORNER} 0 ${CORNER} black`,
				}}
			/>

			<div
				key="corner--tr"
				className={"debug"}
				style={{
					pointerEvents: "auto",
					position: "absolute",
					top: 0,
					right: 0,
					width: CORNER,
					height: CORNER,
					borderTopRightRadius: CORNER,
					backgroundColor: "transparent",
					boxShadow: `${CORNER} -${CORNER} 0 ${CORNER} black`,
				}}
			/>

			<div
				key="corner--bl"
				className={"debug"}
				style={{
					pointerEvents: "auto",
					position: "absolute",
					bottom: 0,
					left: 0,
					width: CORNER,
					height: CORNER,
					borderBottomLeftRadius: CORNER,
					backgroundColor: "transparent",
					boxShadow: `-${CORNER} ${CORNER} 0 ${CORNER} black`,
				}}
			/>

			<div
				key="corner--br"
				className={"debug"}
				style={{
					pointerEvents: "auto",
					position: "absolute",
					bottom: 0,
					right: 0,
					width: CORNER,
					height: CORNER,
					borderBottomRightRadius: CORNER,
					backgroundColor: "transparent",
					boxShadow: `${CORNER} ${CORNER} 0 ${CORNER} black`,
				}}
			/>
		</div>
	)
}

/////////////////////////////////////////////////

// geometry bc. can have insets AND/OR fold AND/OR titlebar
interface ScreenGeometry {
	hasꓽinset: boolean
	hasꓽfold: boolean
	hasꓽtitlebar: boolean
}

// cached at module level: use() needs a stable promise across renders
// NOT async: an async function would wrap the cached promise into a new one on every call
let globalⳇೱᐧhasꓽgeometry_css_vars: Promise<boolean> | undefined = undefined
function getꓽೱᐧhasꓽgeometry_css_vars(): Promise<boolean> {
	globalⳇೱᐧhasꓽgeometry_css_vars ??= poll(
		() => getComputedStyle(document.documentElement).getPropertyValue("--safe-area-inset-top").trim() !== "",
		{
			periodMs: 500,
			timeoutMs: 5_000,
			debugId: "FakeInset waiting for geometry CSS vars",
		},
	).then(
		() => true,
		() => false,
	)
	return globalⳇೱᐧhasꓽgeometry_css_vars
}

// cached at module level: must be detected BEFORE we fake an inset, which would otherwise be detected as a natural one
let globalⳇscreen_geometry: ScreenGeometry | undefined = undefined
function getꓽscreen_geometry(): ScreenGeometry {
	globalⳇscreen_geometry ??= detectꓽscreen_geometry(getComputedStyle(document.documentElement))
	return globalⳇscreen_geometry
}

function detectꓽscreen_geometry(computed_styles: CSSStyleDeclaration): ScreenGeometry {
	const data = (() => {
		const raw = {
			safe_area_inset__top: computed_styles.getPropertyValue("--safe-area-inset-top"),
			safe_area_inset__bottom: computed_styles.getPropertyValue("--safe-area-inset-bottom"),
			safe_area_inset__left: computed_styles.getPropertyValue("--safe-area-inset-left"),
			safe_area_inset__right: computed_styles.getPropertyValue("--safe-area-inset-right"),

			fold__top: computed_styles.getPropertyValue("--fold-top"),
			fold__bottom: computed_styles.getPropertyValue("--fold-bottom"),
			fold__left: computed_styles.getPropertyValue("--fold-left"),
			fold__right: computed_styles.getPropertyValue("--fold-right"),

			titlebar_area__x: computed_styles.getPropertyValue("--titlebar-area-x"),
			titlebar_area__y: computed_styles.getPropertyValue("--titlebar-area-y"),
			titlebar_area__width: computed_styles.getPropertyValue("--titlebar-area-width"),
			titlebar_area__height: computed_styles.getPropertyValue("--titlebar-area-height"),
		}
		return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, normalizeꓽcss_value(value)])) as Record<
			keyof typeof raw,
			string
		>
	})()
	DEBUG && console.log(`${NAME} detecting initial screen geometry...`, data)

	const screen_geometry: ScreenGeometry = {
		hasꓽinset:
			data.safe_area_inset__top !== "0px" ||
			data.safe_area_inset__bottom !== "0px" ||
			data.safe_area_inset__left !== "0px" ||
			data.safe_area_inset__right !== "0px",

		hasꓽfold:
			data.fold__top !== "0px" ||
			data.fold__bottom !== "0px" ||
			data.fold__left !== "0px" ||
			data.fold__right !== "0px",

		hasꓽtitlebar:
			data.titlebar_area__x !== "0px" ||
			data.titlebar_area__y !== "0px" ||
			data.titlebar_area__width !== "0px" ||
			data.titlebar_area__height !== "0px",
	}
	DEBUG && console.log(`${NAME} detected:`, screen_geometry)

	return screen_geometry
}

function normalizeꓽcss_value(raw: string): string {
	const value = raw.trim()
	const isꓽzero_px = /^[-+]?0*\.?0+px$/.test(value) // "0.0px", "-0px", ".0px"...
	return isꓽzero_px ? "0px" : value
}

/////////////////////////////////////////////////

import { Suspense, use, useEffect } from "react"

import { ೱᐧpage_loaded } from "@monorepo-private/page-loaded"
import { poll } from "@monorepo-private/poll"
