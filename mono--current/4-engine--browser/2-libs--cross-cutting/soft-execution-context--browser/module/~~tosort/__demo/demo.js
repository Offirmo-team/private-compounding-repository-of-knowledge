/* eslint-disable no-unused-vars */
import { createLogger } from '@offirmo/practical-logger-browser'
import { getRootSXC } from '@monorepo-private/soft-execution-context'

import {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '../src/index.ts'
import * as good_lib from './good_lib.ts'

const APP = 'SXC_BROWSER_DEMO'

const logger = createLogger({
	name: APP,
	suggestedLevel: 'silly',
})

logger.notice(`Hello from ${APP}...`)


const SXC = getRootSXC()
	.setLogicalStack({
		module: APP,
	})
	.injectDependencies({
		logger,
	})

SXC.emitter.on('final-error', function onError({SXC, err}) {
	const styles = {
		error: 'color: red; font-weight: bold',
	}

	console.groupCollapsed(`%c💣💣💣 Crashed! 💣💣💣 "${err.message}"`, styles.error)
	console.log(`%c${err.message}`, styles.error)
	console.log('details', err.details)
	console.log(err)
	console.groupEnd()

	SXC.fireAnalyticsEvent('error', {
		...err.details,
		message: err.message,
	})
})


SXC.emitter.on('analytics', function onError({SXC, eventId, details}) {
	console.groupCollapsed(`⚡ Analytics! ⚡ "${eventId}"`)
	console.log(`eventId: "${eventId}"`)
	console.log('details', details)
	console.groupEnd()
})

listenToErrorEvents()
listenToUnhandledRejections()
decorateWithDetectedEnv()

// Top uses tryCatch
SXC.xTry('starting', ({SXC, logger}) => {
	const good_lib_inst = good_lib.create({SXC})
	SXC.xTry('calling good lib', () => good_lib_inst.foo_sync({x: 1}))

	throw new Error('Ha ha')
/*
	SXC.xPromiseTry('crashing in a promise', () => {
		throw new Error('Ho ho')
	})*/
})
