import { type CSSProperties, type ErrorInfo } from "react"

/////////////////////////////////////////////////

type Props = ErrorBoundaryPayload

// TODO 1D make this url customizable
const BUG_REPORT_URL = "https://github.com/Offirmo-team/private-compounding-repository-of-knowledge/issues"

export function ErrorOverlay({ error, errorInfo, ownerStack, context: { name } }: Props) {
	return (
		<div key={`error:${name}`} className={`o⋄error-report error-boundary-report-${name}`} style={{ padding: ".3em" }}>
			<h2 style={{ margin: "0" }}>Boundary "{name}": Something went wrong</h2>
			<details open={false} style={{ whiteSpace: "pre-wrap", margin: ".3em 0" }}>
				<summary>{(error || "unknown error").toString()}</summary>
				componentStack = {(errorInfo?.componentStack || "(unknown)").trim()}
				<br />
				ownerStack = {(ownerStack || "(unknown)").trim()}
			</details>
			<a href={BUG_REPORT_URL} target="_blank" referrerPolicy="no-referrer-when-downgrade" rel="noopener external">
				<strong>Report bug</strong>
			</a>
			&nbsp;
			<button
				style={{ "--o⋄color⁚fg--main": "var(--o⋄color⁚fg--error)" } as CSSProperties}
				onClick={() => window.location.reload()}
			>
				Reload page
			</button>
		</div>
	)
}

/////////////////////////////////////////////////

import type { ErrorBoundaryPayload } from "../type.ts"
