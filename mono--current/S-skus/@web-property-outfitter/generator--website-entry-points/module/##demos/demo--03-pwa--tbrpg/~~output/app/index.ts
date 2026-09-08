import { asap_but_out_of_immediate_execution } from '@monorepo-private/utils--async'
import { VERSION, BUILD_DATE } from '../build.ts'

//import { CHANNEL } from './services/channel'

/////////////////////////////////////////////////

console.info(
	`%c The Boring RPG %cv${VERSION}%c${BUILD_DATE}`,
	'border-radius: 1em; padding: .1em .5em; margin-inline-end: 1ch; background-color: hsl(337, 16%, 28%); color: hsl(42, 100%, 87%); font-weight: bold;',
	'border-radius: 1em; padding: .1em .5em; margin-inline-end: 1ch; background-color: darkgrey; color: black; font-weight: bold;',
	'border-radius: 1em; padding: .1em .5em; margin-inline-end: 1ch; background-color: darkgrey; color: black;',
)

/////////////////////////////////////////////////

asap_but_out_of_immediate_execution(async () => {
	console.log('%c——————— end of immediate, synchronous, non-import code. ———————', 'font-weight: bold;')

	const logger = (await import('./services/logger.ts')).default

	// order is important! Timing is non-trivial!
	const initⵧservices = await import('./services/init/*.ts')
	await Object.keys(initⵧservices)
		.sort()
		.reduce(async (acc, key) => {
			await acc
			logger.group(`services/init "${key}"`)
			logger.trace(`services/init "${key}": import…`)
			const init_fn = (await initⵧservices[key]()).default
			logger.trace(`services/init "${key}": exec…`)
			await init_fn()
			logger.trace(`services/init "${key}": done✅`)
			logger.groupEnd()
		}, Promise.resolve())

	// order is important! Timing is non-trivial!
	const initⵧview = await import('./view/init/*.tsx')
	await Object.keys(initⵧview)
		.sort()
		.reduce(async (acc, key) => {
			await acc
			logger.group(`services/view "${key}"`)
			logger.trace(`services/view "${key}": import…`)
			const init_fn = (await initⵧview[key]()).default
			logger.trace(`services/view "${key}": exec…`)
			await init_fn()
			logger.trace(`services/view "${key}": done✅`)
			logger.groupEnd()
		}, Promise.resolve())
})
