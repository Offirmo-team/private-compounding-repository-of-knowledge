import { getꓽUTC_timestamp‿ms } from "@monorepo-private/timestamps"
import { createError as _createError, normalizeError, type XXError } from "@monorepo-private/utils--error"

import type { Operation } from "../../../types.ts"
import { INTERNAL_PROP } from "../../consts.ts"
import * as TopState from "../../state.ts"
import type { InternalSXC } from "../../types.ts"
import { flattenOwnAndInheritedProps } from "../../utils.ts"
import type { SXCPlugin } from "../types.ts"

import { _create_catcher } from "./catch-factory.ts"
import * as StateFns from "./state.ts"
import { type State } from "./state.ts"

const PLUGIN_ID: SXCPlugin["id"] = "error_handling"

function _clean_temp(err: XXError) {
	delete err._temp
	return err
}

function _handleError(
	{
		SXC,
		debugId = "?",
		shouldRethrow = true,
	}: {
		SXC: InternalSXC
		debugId?: string
		shouldRethrow?: boolean
	},
	err: unknown,
) {
	_create_catcher({
		debugId,
		decorators: [
			(err) => normalizeError(err, { alwaysRecreate: true }),
			(err) => SXC._decorateErrorWithLogicalStack(err as XXError),
			(err) => SXC._decorateErrorWithDetails(err as XXError),
		],
		onError: shouldRethrow
			? undefined
			: (err) => {
					const params = {
						...SXC.getInjectedDependencies(),
						err: _clean_temp(err as XXError),
					}
					SXC.emitter.emit("final-error", params)
				},
	})(err)
}

const PLUGIN: SXCPlugin = {
	id: PLUGIN_ID,
	state: StateFns,
	augment: (prototype) => {
		prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err: XXError) {
			const SXC = this
			const state = SXC[INTERNAL_PROP]
			const now = getꓽUTC_timestamp‿ms()

			const { ENV, SESSION_START_TIME_MS } = SXC.getInjectedDependencies()
			const autoDetails = {
				ENV,
				TIME: now,
				SESSION_DURATION_MS: now - SESSION_START_TIME_MS,
			}
			const userDetails = flattenOwnAndInheritedProps(state.plugins[PLUGIN_ID].details)
			err.details = {
				...autoDetails,
				...userDetails,
				...(err.details || {}),
			}

			return err
		}

		prototype.setErrorDetails = function setErrorDetails(details: Record<string, any>) {
			const SXC = this
			let root_state = SXC[INTERNAL_PROP]

			root_state = TopState.reduce_plugin<State>(root_state, PLUGIN_ID, (plugin_state) => {
				Object.entries(details).forEach(([key, value]) => {
					plugin_state = StateFns.addDetail(plugin_state, key, value)
				})
				return plugin_state
			})

			this[INTERNAL_PROP] = root_state

			return SXC // for chaining
		}
		// this getter should normally not be used, errors are automatically decorated
		prototype.getErrorDetails = function getErrorDetails(): Record<string, any> {
			const SXC = this
			const plugin_state = SXC[INTERNAL_PROP].plugins[PLUGIN_ID]

			return flattenOwnAndInheritedProps(plugin_state.details)
		}

		// useful if creating an error later from a saved SXC, ex. from a pipeline
		prototype.createError = function createError(message: string, details: Record<string, any> = {}) {
			const SXC = this
			const err = _createError(message, details)
			err.framesToPop = (err.framesToPop || 0) + 1

			return SXC._decorateErrorWithLogicalStack(SXC._decorateErrorWithDetails(err))
		}

		// for termination promises
		prototype.handleError = function handleError(err: unknown, debugId: string): void {
			const SXC = this
			_handleError(
				{
					SXC,
					debugId,
					shouldRethrow: false,
				},
				err,
			)
		}

		prototype.xTry = function xTry<R, Injections, AnalyticsDetails, ErrorDetails>(
			operation: string,
			fn: Operation<R, Injections, AnalyticsDetails, ErrorDetails>,
		): R {
			console.assert(!!operation)
			const SXC = this.createChild().setLogicalStack({ operation })

			const params = SXC.getInjectedDependencies()

			try {
				return fn(params)
			} catch (err) {
				_handleError(
					{
						SXC,
						debugId: "xTry",
						shouldRethrow: true, // <-- Note this!!
					},
					err,
				)
				throw err // <- just for typescript, will never be reached
			}
		}

		prototype.xTryCatch = function xTryCatch<R, Injections, AnalyticsDetails, ErrorDetails>(
			operation: string,
			fn: Operation<R, Injections, AnalyticsDetails, ErrorDetails>,
		): void {
			console.assert(!!operation)
			const SXC = this.createChild().setLogicalStack({ operation })

			const params = SXC.getInjectedDependencies()

			try {
				fn(params)
			} catch (err) {
				_handleError(
					{
						SXC,
						debugId: "xTryCatch",
						shouldRethrow: false, // <-- Note this!!
					},
					err,
				)
			}
		}

		/* TODO clarify
		prototype.xNewPromise = function xPromise<R>(operation: string, resolver_fn): Promise<R> {
			console.assert(!!operation)
			const SXC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SXC.getInjectedDependencies()

			return (new Promise(resolver_fn.bind(undefined, params)))
				.catch(err => {
					_handleError({
						SXC,
						debugId: 'xPromise',
						shouldRethrow: true, // <-- Note this!!
					}, err)
				})
		}*/

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/try
		prototype.xPromiseTry = function xPromiseTry<R, Injections, AnalyticsDetails, ErrorDetails>(
			operation: string,
			fn: Operation<R | Promise<R>, Injections, AnalyticsDetails, ErrorDetails>,
		): Promise<R> {
			console.assert(!!operation)
			const SXC = this.createChild().setLogicalStack({ operation })

			const params = SXC.getInjectedDependencies()

			// TODO actual Promise.try in 2026
			return Promise.resolve()
				.then(() => fn(params))
				.catch((err: unknown) => {
					_handleError(
						{
							SXC,
							debugId: "xPromiseTry",
							shouldRethrow: true, // <-- Note this!!
						},
						err,
					)
				}) as any // stupid TS
		}
	},
}

export { PLUGIN }
