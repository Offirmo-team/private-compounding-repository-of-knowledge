import { promiseTry } from "@monorepo-private/promise-try"

promiseTry(() => {
	throw new Error("Oups!")
})
	.then(
		() => console.log("OK (UNEXPECTED!)"),
		() => console.error("error! (expected)"),
	)
	.catch(console.error)
