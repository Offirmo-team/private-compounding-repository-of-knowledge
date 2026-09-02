/* Intelligent hi-res background image
 * Features:
 * - either explicitly sized or auto adjust to parent component
 * - desktop-first, mobile friendly
 * - intelligently handle portrait/landscape with "focus points" to ensure no awkward displays
 * - (TODO) intelligently handle portrait/landscape with auto-rotate (if allowed)
 * - (TODO) mobile friendliness with max density = zoom on small screens (ex. starry sky)
 * - (TODO) desktop friendliness with min density = avoid over-zoom on hi-res screens by using pillarboxing
 * - (TODO) parallax effect for better immersion
 * - (TODO) pre-load next bg
 * - (TODO) transition between bgs
 * - (TODO) credits pill
 */

/////////////////////////////////////////////////

const { format: formatForSize } = new Intl.NumberFormat("en", {
	style: "decimal",
	maximumFractionDigits: 1,
	minimumFractionDigits: 0,
	useGrouping: false,
})

const DEBUG = true
const rng_engine = getꓽengine.good_enough()
const RESIZE_DEBOUNCE_MSⳇauto_view_sizing = 200

/////////////////////////////////////////////////

export interface Props {
	view__dimension?: Dimensions2DSpec

	bg: Immutable<Background>
	alt_alignment?: PositiveInteger | "random"

	_debug?: boolean
}

const NAME = "<BackgroundImg>"

export function BackgroundImg(props: Props) {
	const { bg } = props

	useEffect(() => {
		// preload + detect load errors / declared-vs-intrinsic size mismatches, independently of page-load or view sizing
		const img = new Image()
		img.onload = () => {
			if (img.naturalWidth !== bg.width || img.naturalHeight !== bg.height) {
				console.error(`${NAME} declared size mismatch`, {
					declared: { width: bg.width, height: bg.height },
					intrinsic: { width: img.naturalWidth, height: img.naturalHeight },
					url: bg.asset.url,
				})
			}
		}
		img.onerror = (err) => {
			console.error(`${NAME} failed to load background image`, { url: bg.asset.url, err })
		}
		img.src = bg.asset.url

		return () => {
			img.onload = null
			img.onerror = null
		}
	}, [bg.asset.url, bg.width, bg.height])

	return (
		<Suspense fallback={null}>
			<BackgroundImgⵧloaded {...props} />
		</Suspense>
	)
}

function BackgroundImgⵧloaded(props: Props) {
	const NAME = "<BackgroundImg>"
	const isꓽview_explicitly_sized = !!props.view__dimension

	if (!isꓽview_explicitly_sized) {
		// viewport sizing is not available before the page is loaded, wait for it
		use(ೱᐧpage_loaded)
	}

	const [ref, setRef] = useState<SVGSVGElement | null>(null)
	const [auto_view__dimension, setAutoꓽview__dimension] = useState<Dimensions2D>({ width: 10, height: 10 })

	useEffect(() => {
		if (isꓽview_explicitly_sized || !ref) return

		let debounce_timeout: ReturnType<typeof setTimeout> | undefined

		const measure = () => setAutoꓽview__dimension(ref.getBoundingClientRect())
		measure()

		const observer = new ResizeObserver(() => {
			clearTimeout(debounce_timeout)
			debounce_timeout = setTimeout(measure, RESIZE_DEBOUNCE_MSⳇauto_view_sizing)
		})
		observer.observe(ref)

		return () => {
			clearTimeout(debounce_timeout)
			observer.disconnect()
		}
	}, [isꓽview_explicitly_sized, ref])

	const { bg, _debug = DEBUG } = props

	const viewᄆ: Dimensions2D = isꓽview_explicitly_sized
		? getꓽdimensions2D(props.view__dimension)
		: auto_view__dimension
	console.log(`${NAME} render()`, { view__dimension: viewᄆ })

	const viewBox‿arr: SvgⳇViewBox = (() => {
		// We reproduce this algorithm
		// https://developer.mozilla.org/en-US/docs/Web/CSS/background-position

		// first, are we sliding horizontally or vertically?
		const ratioⵧbg = bg.width / bg.height
		const ratioⵧview = viewᄆ.width / viewᄆ.height
		const widest = ratioⵧbg > ratioⵧview ? "bg" : "view" // TODO clarify

		if (widest === "bg") {
			const viewport_width = bg.height * ratioⵧview
			const max_x = bg.width - viewport_width
			let focus: number | undefined = (() => {
				const candidates = bg.focusesⵧhorizontal || []

				if (candidates.length <= 1) return candidates[0]

				switch (props.alt_alignment) {
					case undefined:
					case "random":
						return getꓽrandom.picker.of(candidates || [])(rng_engine)
					default:
						return candidates[Number(props.alt_alignment)]
				}
			})()
			if (!focus && (bg.focusesⵧhorizontal !== undefined || props.alt_alignment !== undefined)) {
				console.error(`${NAME} failed to find a focus`, {
					focusesⵧhorizontal: bg.focusesⵧhorizontal,
					alt_alignment: props.alt_alignment,
				})
			}
			focus ??= Math.random()
			return [max_x * Math.min(100, Math.max(0, focus)), 0, viewport_width, bg.height]
		}

		const viewport_height = bg.width / ratioⵧview
		const max_y = bg.height - viewport_height
		let focus: number | undefined = (() => {
			const candidates = bg.focusesⵧvertical || []

			if (candidates.length <= 1) return candidates[0]

			switch (props.alt_alignment) {
				case undefined:
				case "random":
					return getꓽrandom.picker.of(candidates)(rng_engine)
				default:
					return candidates[Number(props.alt_alignment)]
			}
		})()
		if (!focus && (bg.focusesⵧvertical !== undefined || props.alt_alignment !== undefined)) {
			console.error(`${NAME} failed to find a focus`, {
				focusesⵧvertical: bg.focusesⵧvertical,
				alt_alignment: props.alt_alignment,
			})
		}
		focus ??= Math.random()
		return [0, max_y * Math.min(100, Math.max(0, focus)), bg.width, viewport_height]
	})()
	console.log({ viewBox‿arr })

	// https://alistapart.com/article/practical-svg/
	return (
		<svg
			debug-id={NAME}
			key={NAME}
			{...(!isꓽview_explicitly_sized && { className: "o⋄fill-parent" })}
			width={viewᄆ.width}
			height={viewᄆ.height}
			ref={(new_ref) => setRef(new_ref)}
			viewBox={viewBox‿arr.map(formatForSize).join(" ")}
		>
			{/* out of safety, a plain background */}
			<rect x="0" y="0" width={bg.width} height={bg.height} fill="black" />

			{/* The image, always, full size */}
			<g>
				<image
					x="0"
					y="0"
					width={bg.width}
					height={bg.height}
					href={bg.asset.url}
					preserveAspectRatio="xMidYMid slice" // DEFENSIVE, only useful if the declared size don't match the image = avoid borders
				/>
				{_debug && (
					<g stroke="red">
						<line x1="0" y1="0" x2={bg.width} y2={bg.height} />
						<line x1={bg.width} y1="0" x2="0" y2={bg.height} />
						<rect x="0" y="0" width={bg.width} height={bg.height} fill="none" />
					</g>
				)}
			</g>

			{_debug && (
				<g stroke="green">
					<line
						x1={viewBox‿arr[0]}
						y1={viewBox‿arr[1]}
						x2={viewBox‿arr[0] + viewBox‿arr[2]}
						y2={viewBox‿arr[1] + viewBox‿arr[3]}
					/>
					<line
						x1={viewBox‿arr[0] + viewBox‿arr[2]}
						y1={viewBox‿arr[1]}
						x2={viewBox‿arr[0]}
						y2={viewBox‿arr[1] + viewBox‿arr[3]}
					/>
					<rect x={viewBox‿arr[0]} y={viewBox‿arr[1]} width={viewBox‿arr[2]} height={viewBox‿arr[3]} fill="none" />
				</g>
			)}
		</svg>
	)
}

export default BackgroundImg

/////////////////////////////////////////////////

import { Suspense, use, useEffect, useState } from "react"

import { type Background } from "@monorepo-private/assets--background"
import { ೱᐧpage_loaded } from "@monorepo-private/page-loaded"
import { getꓽrandom, getꓽengine } from "@monorepo-private/random"
import ErrorBoundary from "@monorepo-private/react--error-boundary"
import "@monorepo-private/css--framework"
import { type Immutable, type PositiveInteger } from "@monorepo-private/ts--types"
import {
	type Dimensions2DSpec,
	type Dimensions2D,
	type SvgⳇViewBox,
	getꓽdimensions2D,
} from "@monorepo-private/ts--types--hypermedia"
