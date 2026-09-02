import { type ErrorInfo, type CSSProperties } from "react"

/////////////////////////////////////////////////

interface Props {
	name: string
	error: unknown
	errorInfo: ErrorInfo | undefined // not sure it can be undefined but just in case…
}

function ErrorOverlay({ name, error, errorInfo }: Props) {
	return (
		<div key={`error:${name}`} className={`o⋄error-report error-boundary-report-${name}`} style={{ padding: ".3em" }}>
			<h2 style={{ margin: "0" }}>Boundary "{name}": Something went wrong</h2>
			<details open={false} style={{ whiteSpace: "pre-wrap", margin: ".3em 0" }}>
				<summary>{(error || "unknown error").toString()}</summary>
				componentStack = {(errorInfo?.componentStack || "(none)").trim()}
				<br />
				digest = {(errorInfo?.digest || "(none)").trim()}
			</details>
			<a
				href="https://github.com/Offirmo/offirmo-monorepo/issues"
				target="_blank"
				referrerPolicy="no-referrer-when-downgrade"
				rel="noopener external"
			>
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

export { type Props, ErrorOverlay }
