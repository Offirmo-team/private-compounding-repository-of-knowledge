import { type SoftExecutionContext, getRootSXC, type WithSXC } from "@monorepo-private/soft-execution-context"

/////////////////////////////////////////////////

const LIB = "LIBⵧGOOD"

function getꓽSXCⵧLIB(parent?: SoftExecutionContext): SoftExecutionContext {
	return (parent || getRootSXC()).createChild().setLogicalStack({ module: LIB })
}

/////////////////////////////////////////////////

let instance_count = 0

function create({ SXC }: Partial<WithSXC<any, any, any>> = {}) {
	instance_count++
	const SXCⵧLIB = getꓽSXCⵧLIB(SXC)

	return SXCⵧLIB.xTry(`instantiating#${instance_count}`, ({ logger, ENV }) => {
		logger.debug(`instantiating ${LIB} #${instance_count}`, { ENV })

		// test
		/*;[
			'fatal',
			'emerg',
			'alert',
			'crit',
			'error',
			'warning',
			'warn',
			'notice',
			'info',
			'verbose',
			'log',
			'debug',
			'trace',
			'silly',
		].forEach(level => logger[level]({level}))*/

		function foo_sync({ SXC, q }: Partial<WithSXC<any> & { q: any }> = {}): number {
			getꓽSXCⵧLIB(SXC).xTry(foo_sync.name, () => {
				if (!q) {
					throw new Error("Missing arg x!") // msg will/should be auto-prefixed :-)
				}
			})

			return 42
		}

		async function foo_async({ SXC, q }: Partial<WithSXC<any> & { q: any }> = {}): Promise<number> {
			return getꓽSXCⵧLIB(SXC).xPromiseTry(foo_async.name, ({ logger }) => {
				logger.log("attempting to do X...")
				return new Promise((resolve, reject) => {
					setTimeout(() => reject(new Error("failed to do X in time!")), 100) // msg will/should be auto-prefixed :-)
				})
			})
		}

		return {
			foo_sync,
			foo_async,
		}
	})
}

/////////////////////////////////////////////////

export { create }
