import { getRootSEC } from '@monorepo-private/soft-execution-context'

const LIB = 'OMR:view-browser-react'

function getꓽSEC(parent) {
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
}

export {
	getꓽSEC,
}
