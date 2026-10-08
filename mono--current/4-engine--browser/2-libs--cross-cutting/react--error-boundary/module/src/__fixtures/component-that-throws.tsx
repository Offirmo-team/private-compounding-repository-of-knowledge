import { useState } from "react"

/** To test Error Boundaries */
export function ComponentThatThrows() {
	const [_, setFoo] = useState(0)

	return (
		<>
			<button
				onClick={() => {
					setFoo((_) => {
						throw new Error("Bar!")
					})
				}}
			>
				💣 throw new Error() during a setState()
			</button>

			<button
				onClick={() => {
					setFoo((_) => {
						throw "Baz!"
					})
				}}
			>
				💣 throw string during a setState()
			</button>

			<button
				onClick={() => {
					throw new Error("Foo!")
				}}
			>
				💣 throw directly (NOT caught by ErrorBoundary)
			</button>

			<button
				onClick={() => {
					throw new Error("Foo!")
				}}
			>
				💣 TODO 1D throw through SXC
			</button>
		</>
	)
}
