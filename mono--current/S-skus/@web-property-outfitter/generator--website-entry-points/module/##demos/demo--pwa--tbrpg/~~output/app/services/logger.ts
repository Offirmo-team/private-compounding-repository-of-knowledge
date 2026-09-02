import { getLogger } from '@offirmo/universal-debug-api-browser'

import { LIB } from '../consts.ts'

/////////////////////////////////////////////////

const logger = getLogger({
	name: LIB,
	suggestedLevel: 'error',
	//suggestedLevel: 'silly',
})

console.log(`🗂 Logger up with level "${logger.getLevel()}". Reminder to check your dev tools log level!`)

/////////////////////////////////////////////////

export default logger
