// not using SXC

/////////////////////////////////////////////////

function bar_sync({ x }: { x?: any } = {}): number {
	if (!x) {
		// 🤕 throw generic error, unclear
		// 🤕 and not even throwing a proper error!
		throw "Bad arg!"
	}

	return 42
}

async function bar_async() {
	/*
	// 🤕 throw synchronously
	if (!x) {
		// 🤕 throw generic error, unclear
		// 🤕 and not even throwing a proper error!
		throw 'Bad arg!'
	}
	 */

	return new Promise((resolve, reject) => {
		setTimeout(() => reject("failed to do X in time"), 100) // unclear error message
	})
}

/////////////////////////////////////////////////

export { bar_sync, bar_async }
