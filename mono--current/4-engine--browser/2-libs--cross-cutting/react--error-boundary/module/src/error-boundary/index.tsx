/////////////////////////////////////////////////

export interface Props extends React.PropsWithChildren, React.Attributes {
	render?: () => React.ReactNode

	/** Name of the boundary for identification */
	name: string

	/** To properly error if available */
	SXC?: SoftExecutionContext

	/** TODO REVIEW Optional additional details to be included in the error payload */
	//details?: Record<string, unknown>;

	/** TODO REVIEW Optional callback when an error is caught, ex. to dismiss a modal or a loading state */
	//onError?: (payload: ErrorBoundaryPayload) => void;

	/** TODO REVIEW Fallback to render when an error has occurred */
	//fallback?: ComponentType<ErrorBoundaryFallbackProps>;
	/** TODO REVIEW Is fatal for the application */
	//isFatal?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	mounted = true // need to track that in case an error happen during unmounting = less important
	SXC: SoftExecutionContext
	override state: State = {
		error_dataⵧearly: null,
		error_dataⵧfull: null,
	}

	constructor(props: Props) {
		super(props)

		const { name, SXC: parentSXC = getRootSXC() } = props
		assert(name, "ErrorBoundary must have a name!!!")
		this.SXC = parentSXC
			.createChild()
			.setLogicalStack({ module: `ErrorBoundary:${name}` })
			.setAnalyticsAndErrorDetails({
				error_boundary: name,
			})
	}

	override componentDidMount() {
		// Important for StrictMode where component is un-mounted then re-mounted
		//console.warn(`componentDidMount`)
		this.mounted = true
	}

	override componentWillUnmount() {
		//console.warn(`componentWillUnmount`)
		this.mounted = false
	}

	/** https://react.dev/reference/react/Component#static-getderivedstatefromerror */
	/* - recommended by React documentation
	 * - enforced by dev mode
	 * - BUT unfortunately we have no access to errorInfo here :/
	 */
	public static getDerivedStateFromError(error: unknown) {
		const error_dataⵧearly: ErrorBoundaryPayload = {
			error,

			// React details https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
			errorInfo: undefined,
			ownerStack: captureOwnerStack?.() ?? undefined, // conditional export https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available

			// custom info
			context: {
				name: undefined,
			},
		}

		return { error_dataⵧearly }
	}

	/**
	 * https://react.dev/reference/react/Component#componentdidcatch
	 *
	 * - Defined as a member var to be able to pass it around
	 */
	override componentDidCatch = (error: unknown, errorInfo: ErrorInfo) => {
		const { name } = this.props

		const error_dataⵧfull: ErrorBoundaryPayload = {
			error,

			// React details https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
			errorInfo,
			ownerStack: captureOwnerStack?.() ?? undefined, // conditional export https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available

			// custom info
			context: {
				name,
			},
		}

		this.SXC.xTryCatch(`handling error boundary "${name}"`, ({ SXC, logger }) => {
			// reminder: since React 18 this will not do anything if component is unmounted
			this.setState({
				error_dataⵧfull,
			})

			if (this.mounted) {
				// So that we can ask customers to copy-paste / screenshot the error from the console
				console.group("%c---------------------", "color:red;")
				console.log("%cSomething went wrong!", "color:red; font-size: large;")
				console.log(`Error caught in <ui.ErrorBoundary /> "${this.props.name}"`)
				console.log("Message:", normalizeError(error).message)
				console.log("Time:", Date.now())
				console.log(error)
				console.log("errorInfo:", errorInfo)
				console.log("ownerStack:", error_dataⵧfull.ownerStack)
				console.log("%c---------------------", "color:red;")
				console.groupEnd()
			}

			// You can also log error messages to an error reporting service here
			logger.error(`Error caught in boundary "${name}"`, {
				error,
				errorInfo,
				isMounted: this.mounted,
			})
			SXC.fireAnalyticsEvent("react.error-boundary.triggered", {
				err: error,
				isMounted: this.mounted,
			})

			// forward to parent TODO one day if useful
			/*this.props.onError({
				error,
				errorInfo,
				name,
			})*/
		})
	}

	override render() {
		const { name } = this.props
		const { error_dataⵧearly, error_dataⵧfull } = this.state
		if (error_dataⵧearly || error_dataⵧfull) {
			const error_data: ErrorBoundaryPayload = {
				error: error_dataⵧearly?.error ?? error_dataⵧfull?.error,

				// React details https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
				errorInfo: error_dataⵧfull?.errorInfo,
				ownerStack:
					error_dataⵧearly?.ownerStack ?? error_dataⵧfull?.ownerStack ?? captureOwnerStack?.() ?? undefined, // conditional export https://react.dev/reference/react/captureOwnerStack#captureownerstack-is-not-available

				// custom info
				context: {
					name,
				},
			}

			return <ErrorOverlay {...error_data} />
		}

		try {
			return render_any_children(this.props)
		} catch (err) {
			asap_but_not_synchronous(() => this.componentDidCatch(err, {}))
		}

		return null
	}
}

export default ErrorBoundary

/////////////////////////////////////////////////

//errorInfo: ErrorInfoⵧaugmented | undefined
type State =
	| {
			error_dataⵧearly: ErrorBoundaryPayload
			error_dataⵧfull: ErrorBoundaryPayload | undefined
	  }
	| {
			error_dataⵧearly: null
			error_dataⵧfull: null | undefined
	  }

/////////////////////////////////////////////////

import { Component, type ErrorInfo, captureOwnerStack } from "react"

import { assert_from, assert } from "@monorepo-private/assert"
import { getRootSXC, type SoftExecutionContext } from "@monorepo-private/soft-execution-context"
import { asap_but_not_synchronous } from "@monorepo-private/utils--async"
import { normalizeError } from "@monorepo-private/utils--error"

import { ErrorOverlay } from "../error-overlay/index.tsx"
import { render_any_children } from "../render-anything/index.tsx"
import type { ErrorBoundaryPayload } from "../type.ts"
