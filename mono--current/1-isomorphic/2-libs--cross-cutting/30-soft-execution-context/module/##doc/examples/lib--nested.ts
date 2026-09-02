import { type SoftExecutionContext, getRootSXC, type WithSXC } from "@monorepo-private/soft-execution-context"

import * as good_lib from "./lib--good.ts"

/////////////////////////////////////////////////

const LIB = "LIBⵧINDIRECT"

interface CustomInjections {
	good_lib: ReturnType<(typeof good_lib)["create"]>
}

let _good_lib: CustomInjections["good_lib"] | undefined = undefined

function getꓽSXCⵧLIB(
	parent?: SoftExecutionContext,
): SoftExecutionContext<{ good_lib: ReturnType<(typeof good_lib)["create"]> }> {
	const root = getRootSXC()

	// TODO memoize if no parent? TODO review one day
	const SXCⵧLIB = (parent || root).createChild<CustomInjections>().setLogicalStack({ module: LIB })

	if (!_good_lib) {
		_good_lib = SXCⵧLIB.xTry(`init`, ({ SXC }) => {
			return good_lib.create({ SXC })
		})
	}

	SXCⵧLIB.injectDependencies({ good_lib: _good_lib })

	return SXCⵧLIB
}

/////////////////////////////////////////////////

function baz_sync({ SXC, q }: Partial<WithSXC<any> & { q: any }> = {}) {
	return getꓽSXCⵧLIB(SXC).xTry("baz_sync", ({ SXC, good_lib }) => good_lib.foo_sync({ SXC, q }))
}

async function baz_async({ SXC }: Partial<WithSXC<any>> = {}) {
	return getꓽSXCⵧLIB(SXC).xPromiseTry("baz_async", ({ good_lib }) =>
		good_lib.foo_async().then((result) => {
			return new Promise<number>((resolve) => {
				setTimeout(() => resolve(result + 1), 100)
			})
		}),
	)
}

/////////////////////////////////////////////////

export { baz_sync, baz_async }
