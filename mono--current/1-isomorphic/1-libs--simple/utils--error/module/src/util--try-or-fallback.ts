// see also optimized alternative https://github.com/isaacs/catcher

/////////////////////////////////////////////////

function try_or_fallback<Fn extends () => ReturnType<Fn>, T>({
	getter,
	fallback_result,
	onꓽerror = () => {},
}: {
	getter: Fn
	fallback_result: T
	onꓽerror?: (err: unknown) => void
}): ReturnType<Fn> | T {
	try {
		return getter()
	} catch (err) {
		try {
			onꓽerror(err)
		} catch {
			// ignore
		}
		return fallback_result
	}
}

/////////////////////////////////////////////////

export { try_or_fallback }
