import { Component, type ErrorInfo } from "react"

import { assert_from, assert } from "@monorepo-private/assert"
import { getRootSXC, type SoftExecutionContext } from "@monorepo-private/soft-execution-context"
import { asap_but_not_synchronous } from "@monorepo-private/utils--async"

import { ErrorOverlay } from "../error-overlay/index.tsx"
import { render_any_children } from "../render-anything/index.tsx"

/////////////////////////////////////////////////

interface Props {
	name: string
	SXC?: SoftExecutionContext
}

interface State {
	error: unknown | undefined
	errorInfo: ErrorInfo | undefined
}

class ErrorBoundary extends Component<Props, State> {
	mounted = true // need to track that in case an error happen during unmounting
	SXC: SoftExecutionContext
	override state = {
		error: undefined,
		errorInfo: undefined,
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

	// as a member var to be able to pass it around
	override componentDidCatch = (error: unknown, errorInfo: ErrorInfo) => {
		const { name } = this.props

		this.SXC.xTryCatch(`handling error boundary "${name}"`, ({ SXC, logger }) => {
			if (this.mounted) {
				// Catch errors in any components below and re-render with error message
				this.setState({
					error,
					errorInfo,
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
		if (this.state.error || this.state.errorInfo) {
			const { error, errorInfo } = this.state
			return <ErrorOverlay name={name} error={error} errorInfo={errorInfo} />
		}

		try {
			return render_any_children(this.props)
		} catch (err) {
			asap_but_not_synchronous(() =>
				this.componentDidCatch(err, { digest: `crash in ErrorBoundary.render("${name}")` }),
			)
		}

		return null
	}
}

/////////////////////////////////////////////////

export { ErrorBoundary }
export default ErrorBoundary
