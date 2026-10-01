/**
 * IF NOT PRESENT Add fake inset to the viewport to simulate a notch and/or a bottom bar useful for TESTING, should not
 * happen in prod!
 */

/////////////////////////////////////////////////

const CORNER‿px = 40
const CORNER = `${CORNER‿px}px`
const NOTCH_HEIGHT = `${CORNER‿px * 0.9}px`
const NOTCH_BORDER_RADIUS = `${CORNER‿px * 0.9 * 0.75}px`
let globalⳇhasꓽinset: boolean | undefined = undefined
let globalⳇhasꓽfold: boolean | undefined = undefined
let globalⳇhasꓽtitlebar: boolean | undefined = undefined
let globalⳇhasꓽscreen_geometry: boolean | undefined = undefined // geometry bc. can have insets OR fold OR titlebar
const DEBUG = true

export function FakeInset() {
	return (
		<Suspense fallback={null}>
			<FakeInsetⵧloaded />
		</Suspense>
	)
}

function FakeInsetⵧloaded() {
	const NAME = "<FakeInset>"
	// viewport sizing is not always available before the page is loaded
	use(ೱᐧpage_loaded)

	const [hasꓽscreen_geometry, setꓽhasꓽscreen_geometry] = useState<boolean | undefined>(globalⳇhasꓽscreen_geometry)
	DEBUG &&
		console.log(`${NAME} render...`, {
			globalⳇhasꓽinset,
			globalⳇhasꓽfold,
			globalⳇhasꓽtitlebar,
			globalⳇhasꓽscreen_geometry,
			hasꓽscreen_geometry,
		})

	const computed_styles = getComputedStyle(document.documentElement)
	const currentInsetTop = computed_styles.getPropertyValue("--safe-area-inset-top")
	if (String(currentInsetTop) === "") {
		// we need Offirmo CSS framework to be loaded
		return null
	}

	if (globalⳇhasꓽscreen_geometry === undefined) {
		// first execution of this!
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
			return Object.fromEntries(
				Object.entries(raw).map(([key, value]) => [key, normalizeꓽcss_value(value)]),
			) as Record<keyof typeof raw, string>
		})()
		DEBUG && console.log(`${NAME} render... 1st exec! Detecting initial screen geometry...`, data)

		// the variable is set, we can now check if we naturally have an inset
		globalⳇhasꓽinset =
			data.safe_area_inset__top !== "0px" ||
			data.safe_area_inset__bottom !== "0px" ||
			data.safe_area_inset__left !== "0px" ||
			data.safe_area_inset__right !== "0px"

		globalⳇhasꓽfold =
			data.fold__top !== "0px" ||
			data.fold__bottom !== "0px" ||
			data.fold__left !== "0px" ||
			data.fold__right !== "0px"

		globalⳇhasꓽtitlebar =
			data.titlebar_area__x !== "0px" ||
			data.titlebar_area__y !== "0px" ||
			data.titlebar_area__width !== "0px" ||
			data.titlebar_area__height !== "0px"

		globalⳇhasꓽscreen_geometry = globalⳇhasꓽinset || globalⳇhasꓽfold || globalⳇhasꓽtitlebar // means it's intentionally desktop with titlebar activated = we don't want to fake an inset

		DEBUG &&
			console.log(`${NAME} detected:`, {
				globalⳇhasꓽinset,
				globalⳇhasꓽfold,
				globalⳇhasꓽtitlebar,
			})

		if (globalⳇhasꓽscreen_geometry) {
			console.log(`🖼️ ${NAME}: screen already has funny geometry, not faking inset.`)
		} else {
			console.log(`🖼️ ${NAME}: plain screen detected: faking an inset!`)

			// TODO better fake one depending on the device orientation
			document.documentElement.style.setProperty(
				"--safe-area-inset-top",
				"47px", // iphone 14
			)
			document.documentElement.style.setProperty(
				"--safe-area-inset-bottom",
				"34px", // iPhone 14
			)
		}
		setꓽhasꓽscreen_geometry(globalⳇhasꓽscreen_geometry)
	}

	if (globalⳇhasꓽscreen_geometry) {
		// nothing to do
		return null
	}

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
export default FakeInset

function normalizeꓽcss_value(raw: string): string {
	const value = raw.trim()
	const isꓽzero_px = /^[-+]?0*\.?0+px$/.test(value) // "0.0px", "-0px", ".0px"...
	return isꓽzero_px ? "0px" : value
}

/////////////////////////////////////////////////

import { Suspense, use, useState } from "react"

import { ೱᐧpage_loaded } from "@monorepo-private/page-loaded"
