import EventEmitter from "emittery"

/////////////////////

const ROOT_PROTOTYPE = Object.create(null)

// global bus shared by all SXCs
// TODO should be injected instead?
ROOT_PROTOTYPE.emitter = new EventEmitter()

// common functions

// because we often set the same details
ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
	const SXC = this
	return SXC.setAnalyticsDetails(details).setErrorDetails(details)
}

/////////////////////

export { ROOT_PROTOTYPE }
