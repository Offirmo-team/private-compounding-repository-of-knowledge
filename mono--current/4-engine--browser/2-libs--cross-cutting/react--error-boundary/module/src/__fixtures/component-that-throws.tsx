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
				💣 setState(new Error())
			</button>

			<button
				onClick={() => {
					setFoo((_) => {
						throw "Baz!"
					})
				}}
			>
				💣 setState(string)
			</button>

			<button
				onClick={() => {
					throw new Error("Foo!")
				}}
			>
				💣 direct (not caught by ErrorBoundary)
			</button>
		</>
	)
}
