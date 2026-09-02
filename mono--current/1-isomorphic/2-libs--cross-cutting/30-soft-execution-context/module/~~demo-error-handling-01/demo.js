/* eslint-disable no-unused-vars */
import { createLogger } from '@monorepo-private/practical-logger--browser'

import {getRootSXC} from '../../src/index.ts'
import * as good_lib from './good_lib.ts'

const APP = 'SXC_DEMO_01'

const logger = createLogger({
	name: APP,
	suggestedLevel: 'silly',
})

logger.log(`Hello from ${APP}...`)


const SXC = getRootSXC()
SXC.setLogicalStack({
	module: APP,
})
SXC.injectDependencies({
	logger,
})
SXC.emitter.on('final-error', function onError({ data: {SXC, err}}) {
	logger.fatal('Crashed!', {err})
})

/* TODOOO
SXC.listenToUncaughtErrors()
SXC.listenToUnhandledRejections()
*/

// Top uses tryCatch
SXC.xTryCatch('starting', ({SXC, logger}) => {
	logger.log(SXC.getLogicalStack())

	// sync, immediate
	//throw new Error('Foo')

	// sync, in libs
	/*
	const bad_lib = require('./bad_lib')
	SXC.xTry('calling bad lib', () => bad_lib.foo_sync())
	*/

	const good_lib_inst = good_lib.create({SXC})
	SXC.xTry('calling good lib', () => good_lib_inst.foo_sync())

	/*
	const intercepting_lib = require('./intercepting_lib')
	SXC.xTry('calling intercepting lib', () => intercepting_lib.foo_sync())
	*/

	logger.log('--- this should not be called !! ---')

	//const good_lib_inst = require('./good_lib_inst').create({SXC})

	//return SXC.xPromiseResolve('calling bad lib', bad_lib.foo_async())
	//return intercepting_lib.foo_async()
	//return SXC.xPromiseTry('calling intercepting lib', () => intercepting_lib.foo_async())
	//return good_lib_inst.foo_async().then(() => logger.log('--- this should not be called !! ---'))
})
