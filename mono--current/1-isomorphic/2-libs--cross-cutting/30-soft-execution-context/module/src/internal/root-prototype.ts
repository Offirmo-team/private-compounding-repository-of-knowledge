/////////////////////////////////////////////////
// SXC inheritance relies on a prototypal inheritance chain.
// This is the static root of the chain.

/*
export interface SXCRootPrototype {
	emitter: EventEmitter
	setAnalyticsAndErrorDetails(details: {}): any
}*/

export const ROOT_PROTOTYPE = Object.create(null)

/////////////////////////////////////////////////
// common props

// global bus shared by all SXCs
// TODO review use Web event emitter instead?
ROOT_PROTOTYPE.emitter = new EventEmitter()

/////////////////////////////////////////////////
// common functions

// because we often set the same details
ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
	const SXC = this
	return SXC.setAnalyticsDetails(details).setErrorDetails(details)
}

/////////////////////////////////////////////////

import EventEmitter from "emittery"
