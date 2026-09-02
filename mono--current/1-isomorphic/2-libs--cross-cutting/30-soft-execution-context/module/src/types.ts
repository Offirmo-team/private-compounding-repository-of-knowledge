import Emittery from "emittery"

import { type TimestampUTCMs } from "@monorepo-private/timestamps"
import { type XXError } from "@monorepo-private/utils--error"

/////////////////////////////////////////////////

export interface BaseInjections {
	logger: any // TODO improve typing

	// detected env
	ENV: string
	IS_DEV_MODE: boolean
	IS_VERBOSE: boolean // common CLI flag triggering extra debugging
	CHANNEL: string
	SESSION_START_TIME_MS: TimestampUTCMs
}

export interface BaseAnalyticsDetails {
	ENV: string
	CHANNEL: string
}

export interface BaseErrorDetails {
	ENV: string
	CHANNEL: string
}

export interface WithSXC<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> {
	SXC: SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
}

export interface EventDataMap<Injections, AnalyticsDetails, ErrorDetails> {
	analytics: { eventId: string; details: Record<string, any> }
	"final-error": Injections & BaseInjections & WithSXC<Injections, AnalyticsDetails, ErrorDetails> & { err: XXError }
}

export type OperationParams<Injections, AnalyticsDetails, ErrorDetails> = Injections &
	BaseInjections &
	WithSXC<Injections, AnalyticsDetails, ErrorDetails>

export type Operation<T, Injections, AnalyticsDetails, ErrorDetails> = (
	params: OperationParams<Injections, AnalyticsDetails, ErrorDetails>,
) => T

export interface SoftExecutionContext<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> {
	/////////////////////
	// core
	createChild: <
		ExtraInjections = Injections,
		ExtraAnalyticsDetails = AnalyticsDetails,
		ExtraErrorDetails = ErrorDetails,
	>() => SoftExecutionContext<ExtraInjections, ExtraAnalyticsDetails, ExtraErrorDetails>

	// TODO hide? encapsulate?
	emitter: Emittery<EventDataMap<Injections, AnalyticsDetails, ErrorDetails>>

	/////////////////////
	// plugin: dependency injection
	injectDependencies: (
		p: Partial<
			Injections & BaseInjections
			//& WithSXC<Injections, AnalyticsDetails, ErrorDetails>
		>,
	) => SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getInjectedDependencies: () => Injections & BaseInjections & WithSXC<Injections, AnalyticsDetails, ErrorDetails>

	/////////////////////
	// plugin: logical stack
	setLogicalStack: (p: {
		module?: string
		operation?: string
	}) => SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getLogicalStack: () => string
	getShortLogicalStack: () => string

	/////////////////////
	// convenience analytics + error
	setAnalyticsAndErrorDetails: (
		p: Partial<AnalyticsDetails & ErrorDetails>,
	) => SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>

	/////////////////////
	// plugin: analytics
	setAnalyticsDetails: (
		p: Partial<AnalyticsDetails>,
	) => SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getAnalyticsDetails: () => AnalyticsDetails & BaseAnalyticsDetails
	fireAnalyticsEvent: (
		id: string,
		extraDetails?: any,
	) => SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>

	/////////////////////
	// plugin: error handling
	setErrorDetails: (p: Partial<ErrorDetails>) => SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getErrorDetails: () => ErrorDetails & BaseErrorDetails

	// create a fully decorated error
	// useful if creating an error later from a saved SXC, ex. from a pipeline
	createError: (message: string, details: XXError["details"]) => XXError

	handleError: (err: unknown, debugId: string) => void

	xTry: <T>(operation: string, fn: Operation<T, Injections, AnalyticsDetails, ErrorDetails>) => T
	xTryCatch: <T>(operation: string, fn: Operation<T, Injections, AnalyticsDetails, ErrorDetails>) => T | undefined

	xPromiseTry: <T>(
		operation: string,
		fn: Operation<T | Promise<T>, Injections, AnalyticsDetails, ErrorDetails>,
	) => Promise<T>
	// TODO one day xPromiseTryCatch
	/*xNewPromise: <T>(operation: string, fn: (
		p: Injections
			& BaseInjections
			& WithSXC<Injections, AnalyticsDetails, ErrorDetails>,
		_resolve: (value?: T | PromiseLike<T>) => void,
		_reject: (reason?: any) => void,
	) => void) => Promise<T>*/
}
