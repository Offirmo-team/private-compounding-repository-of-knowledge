/////////////////////////////////////////////////

export interface Props extends React.PropsWithChildren, React.Attributes {
	render?: () => React.ReactNode

	/** Name of the boundary for identification */
	name: string

	/** To properly error if available */
	SXC?: SoftExecutionContext

	/** Optional additional details to be included in the error payload */
	//details?: Record<string, unknown>;

	/** Optional callback when an error is caught, ex. to dismiss a modal or a loading state */
	//onError?: (payload: ErrorBoundaryPayload) => void;

	/** Fallback to render when an error has occurred */
	//fallback?: ComponentType<ErrorBoundaryFallbackProps>;
	/** Is fatal for the application */
	//isFatal?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	mounted = true // need to track that in case an error happen during unmounting
	SXC: SoftExecutionContext
	override state: State = {
		did_catch: false as const,
		error_data: null,
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

	override componentDidMount() {}

	override componentWillUnmount() {
		this.mounted = false
	}

	/** https://react.dev/reference/react/Component#static-getderivedstatefromerror */
	/* I wish I would use this as recommended by React documentation
	 * BUT we have no access to errorInfo here
		public static getDerivedStateFromError(error: unknown) {
		// filter isMounted?
		return { did_catch: true, error }
	}
	 */

	/**
	 * https://react.dev/reference/react/Component#componentdidcatch
	 *
	 * - Defined as a member var to be able to pass it around
	 */
	override componentDidCatch = (error: unknown, errorInfo: ErrorInfo) => {
		const { name } = this.props

		const error_data: ErrorBoundaryPayload = {
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
			if (this.mounted) {
				// Catch errors in any components below and re-render with error message
				this.setState({
					did_catch: true,
					error_data,
				})
			}

			// You can also log error messages to an error reporting service here
			logger.error(`Error caught in react-error-boundary@"${name}"`, {
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
		if (this.state.error_data) {
			return <ErrorOverlay {...this.state.error_data} />
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
			did_catch: true
			error_data: ErrorBoundaryPayload
	  }
	| {
			did_catch: false
			error_data: null
	  }

/////////////////////////////////////////////////

import { Component, type ReactNode, type ErrorInfo, captureOwnerStack } from "react"

import { assert_from, assert } from "@monorepo-private/assert"
import { getRootSXC, type SoftExecutionContext } from "@monorepo-private/soft-execution-context"
import { asap_but_not_synchronous } from "@monorepo-private/utils--async"

import { ErrorOverlay } from "../error-overlay/index.tsx"
import { render_any_children } from "../render-anything/index.tsx"
import type { ErrorBoundaryContext, ErrorBoundaryPayload } from "../type.ts"
