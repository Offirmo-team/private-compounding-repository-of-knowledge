// https://www.npmjs.com/package/@tsparticles/basic
import { loadBasic as loadPlugins } from "@tsparticles/basic"
// https://particles.js.org/
import {
	tsParticles, // https://particles.js.org/docs/classes/tsParticles_Engine.Core_Engine.Engine.html
	MoveDirection,
	type Container,
	type ISourceOptions,
} from "@tsparticles/engine"
import React, { use, useId, useEffect } from "react"

import type { PositiveInteger, PositiveFloat } from "@monorepo-private/ts--types"
import type { CssⳇColor‿str } from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

const DEBUG = false

const LIB = "StarrySky"

interface Options {
	density: PositiveInteger

	stars__size_range: { min: PositiveFloat; max: PositiveFloat }

	background_type: "gradient" | "transparent"
	background__gradient__direction: number
	background__gradient__begin: CssⳇColor‿str
	background__gradient__end: CssⳇColor‿str

	move__speed: number
	move__direction: MoveDirection
}

const DEFAULTS: Options = {
	density: 500,

	stars__size_range: { min: 0.5, max: 2 },

	background_type: "gradient",
	background__gradient__direction: 0,
	background__gradient__begin: "black",
	background__gradient__end: "black",

	move__speed: 0,
	move__direction: MoveDirection.topRight,
}

type Props = Partial<Options>

// inspired from the stars preset https://github.com/tsparticles/presets/blob/main/presets/stars/src/options.ts
function getTsParticlesOptions(options: Options): ISourceOptions {
	return {
		// https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html

		// no-brainer options
		detectRetina: true,
		pauseOnBlur: false,
		pauseOnOutsideViewport: true,
		//fpsLimit: TODO according to perf

		autoPlay: true,
		background: {
			// we provide the background outside tsParticles
		},

		particles: {
			// https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_Particles_IParticlesOptions.IParticlesOptions.html

			number: {
				value: options.density,
				density: {
					// obviously we want the value to be relative to screen size
					enable: true,
					width: 1024,
					height: 1024,
				},
			},
			move: {
				enable: options.move__speed > 0,
				speed: options.move__speed,

				straight: true,
				direction: options.move__direction,

				//random: true,
				/*spin: {
					enable: true,
					direction: 'foo',
				}*/
			},
			opacity: {
				animation: {
					enable: true,
					speed: 0.1,
					sync: false,
				},
				value: { min: 0, max: 1 },
			},
			size: {
				value: options.stars__size_range,
			},
		},
	}
}

// this should be run only once per application lifetime
const ೱLIB_INIT = loadPlugins(tsParticles)
ೱLIB_INIT.then((...args) => {
	DEBUG && console.log(`FYI @tsparticles/basic loaded`, args)
})

/////////////////////////////////////////////////

function StarrySky(props: Props = {}) {
	DEBUG && console.log(`🔄 <StarrySky>`)
	use(ೱLIB_INIT)
	const id = useId()

	const options: Options = {
		...DEFAULTS,
		...props,
	}

	useEffect(() => {
		const optionsⵧtsp = getTsParticlesOptions(options)

		const tempState = {
			active: true,
			ೱcontainer: undefined as Promise<Container | undefined> | undefined,
		}

		DEBUG &&
			console.log(`[${LIB}] #${id} useEffect()…`, {
				tsParticles,
				id,
				options,
				optionsⵧtsp,
				tempState,
			})

		ೱLIB_INIT.then((...args) => {
			if (!tempState.active) return // the component was unmounted in the meantime, no need to proceed further

			tempState.ೱcontainer = tsParticles.load({
				id,
				options: optionsⵧtsp,
			})
			tempState.ೱcontainer.then(() => {
				DEBUG && console.log(`[${LIB}] #${id} tsParticles Container loaded`)
			})
		})

		return () => {
			DEBUG && console.log(`[${LIB}] #${id} cleanup scheduled...`)
			tempState.active = false

			if (tempState.ೱcontainer) {
				DEBUG && console.log(`[${LIB}] #${id} cleanup: found a container, cleaning...`)
				tempState.ೱcontainer.then((container) => {
					if (!container) return

					container.stop() // needed?
					container.destroy(true)
					DEBUG && console.log(`[${LIB}] #${id} cleaned.`)
				})
			}
		}
	}, [id])

	const { background_type, background__gradient__direction, background__gradient__begin, background__gradient__end } =
		options
	const background__color = "black" // TODO mid from gradient

	return (
		<div
			id={id}
			className="o⋄fill-parent"
			style={{
				backgroundColor: background_type === "transparent" ? "transparent" : background__color,
				...(background_type !== "transparent" && {
					background: `linear-gradient(${background__gradient__direction}deg, ${background__gradient__begin} 0%, ${background__gradient__end} 100%)`,
				}),
			}}
		/>
	)
}

/////////////////////////////////////////////////

export { StarrySky, type Props }
export default StarrySky
