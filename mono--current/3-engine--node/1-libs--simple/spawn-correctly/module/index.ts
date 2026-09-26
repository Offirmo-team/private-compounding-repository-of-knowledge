/////////////////////////////////////////////////

const DEBUG = false // for local debug

/////////////////////////////////////////////////

export default ೱspawnCorrectlyAndResolvesWithStdout // what we want most of the time

export interface SpawnError extends Error {
	cause?: Error | unknown // ES2022 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
	reason: string

	stdout: string
	stderr: string
	code: number | undefined | null
	signal: NodeJS.Signals | undefined | null

	spawnCommand: Parameters<typeof spawn>[0]
	spawnArgs: Parameters<typeof spawn>[1] | undefined
	spawnOptions: Parameters<typeof spawn>[2] | undefined
	commandForLog: string
}

export type ChildProcess = ReturnType<typeof spawn>

export interface Options {
	verbose: boolean
	logger: {
		log: (msg: string, details?: any) => void
		warn: (msg: string, details?: any) => void
		error: (msg: string, details?: any) => void
	}
	instrument: (childProcess: ChildProcess) => void
}

// resolves with the result of the accumulator
// or reject with whatever error reason
export async function ೱspawnCorrectly<Result>({
	spawnCommand,
	spawnArgs,
	spawnOptions,
	onStdout,
	extraOptions = {},
}: {
	spawnCommand: Parameters<typeof spawn>[0]
	spawnArgs?: Parameters<typeof spawn>[1]
	spawnOptions?: Parameters<typeof spawn>[2]
	onStdout: (result: Result | undefined, stdoutFragment: string) => Result
	extraOptions?: Partial<Options>
}): Promise<Result> {
	const commandForLog = [spawnCommand, ...(spawnArgs ?? [])].join(" ")
	const shouldLog = extraOptions.verbose ?? DEBUG
	const logger = extraOptions.logger ?? console

	return new Promise<Result>((resolve, reject) => {
		//////////// State
		// accumulators
		let stdout = ""
		let stderr = ""
		let code: number | undefined | null = undefined
		let signal: NodeJS.Signals | undefined | null = undefined
		let result: Parameters<typeof onStdout>[0] = undefined
		let hasAlreadyFailed = false // so far

		function fail(reason: `${string}!`, err?: Error | any) {
			if (hasAlreadyFailed) {
				return
			}
			hasAlreadyFailed = true

			shouldLog && logger.error(`✖ ೱspawnCorrectly: Failure during invocation: ${reason}`)

			code = code ?? err?.errno // may be exposed if node captured it first
			// code and signal are mutually exclusive, enforce it:
			if (code && signal === undefined) {
				signal = null
			}
			if (signal && code === undefined) {
				code = null
			}
			spawnArgs = spawnArgs ?? err?.spawnargs // bc node exposes it

			stdout = stdout.trim()
			stderr = stderr.trim()

			// error message:
			// having "got 'err' event!" is not very informative :-/
			// we try to extract a better reason from the output
			const errᐧmessage = (() => {
				// in order of best message source
				const output = stderr || stdout
				if (output) {
					const MAX_USEFUL_LINES =
						4 + // when debugger attached, 4 lines of "debugger listening on..."
						Math.max(
							6, // node errors starts to be interesting at 5th line
						)
					// NOT os.EOL: line endings come from the child, not from the host OS
					const first_output_lines = output.split(/\r?\n/).slice(0, MAX_USEFUL_LINES)
					for (const line of first_output_lines) {
						const line‿lc = line.toLowerCase()
						if (line‿lc.includes("error") || line‿lc.includes("exception")) return line

						if (line‿lc.includes("not found")) return "Error: " + line
					}
				}

				if (typeof err?.message === "string") return err.message

				return reason // last resort
			})()

			const decoratedErr = new Error(errᐧmessage) as SpawnError
			if (err) decoratedErr.cause = err
			decoratedErr.reason = reason
			decoratedErr.stdout = stdout
			decoratedErr.stderr = stderr
			decoratedErr.code = code
			decoratedErr.signal = signal
			decoratedErr.spawnCommand = spawnCommand
			decoratedErr.spawnArgs = spawnArgs
			decoratedErr.spawnOptions = spawnOptions
			decoratedErr.commandForLog = commandForLog

			reject(decoratedErr)

			shouldLog && logger.error(`✖ ೱspawnCorrectly: rejected with error:`, decoratedErr)
		}

		try {
			shouldLog && logger.log(`► ೱspawnCorrectly(): About to spawn: ${commandForLog}`)
			const childProcess = cross_spawn(spawnCommand, spawnArgs ?? [], spawnOptions ?? {}) as ReturnType<typeof spawn>

			// listen to events
			childProcess.on("error", (err) => {
				fail('got event "err"!', err)
			})
			childProcess.on("disconnect", () => {
				// nothing to do, left for reference only
			})

			childProcess.on("exit", (_code, _signal) => {
				code = code ?? _code
				signal = signal ?? _signal
				// when receiving "exit", io streams may still be open
				// we do nothing, another event "close" will follow.
				if (_code !== 0) {
					// by convention, !0 = failure
					shouldLog && logger.error(`got event "exit" with error code "${_code}" & signal "${_signal}"!`)
				}
			})
			childProcess.on("close", (_code, _signal) => {
				code = code ?? _code
				signal = signal ?? _signal
				if (_code !== 0) {
					fail(`got event "close" with error code "${_code}" & signal "${_signal}"!`)
				} else {
					resolve(result!)
				}
			})

			// for debug purpose only
			if (childProcess.stdin) {
				childProcess.stdin.on("error", (err) => {
					fail(`got stdin event "error"!`, err)
				})
			}
			assert(!!childProcess.stdout, `ೱspawnCorrectly(): should have stdout`)
			// mandatory: without it, chunks are raw Buffers and a multi-byte character
			// straddling a chunk boundary gets decoded as U+FFFD by each half.
			childProcess.stdout.setEncoding("utf8")
			result = onStdout(result, "") // init
			childProcess.stdout.on("data", (data) => {
				const stdoutFragment = String(data)
				stdout += stdoutFragment
				result = onStdout(result, stdoutFragment)
			})
			childProcess.stdout.on("error", (err) => {
				fail(`got stdout event "error"!`, err)
			})

			assert(!!childProcess.stderr, `ೱspawnCorrectly(): should have stderr`)
			childProcess.stderr.setEncoding("utf8") // see stdout above
			childProcess.stderr.on("data", (data) => {
				stderr += String(data)
			})
			childProcess.stderr.on("error", (err) => {
				fail('got stderr event "error"!', err)
			})

			// hook in case the caller needs extra control
			extraOptions?.instrument?.(childProcess)
		} catch (err) {
			fail(`unexpected global catch!`, err)
		}
	}).then((result) => {
		shouldLog && logger.log(`✔ ೱspawnCorrectly(): executed successfully.`)
		return result
	})
}

// resolves with the output of the command
// or reject with whatever error reason
export async function ೱspawnCorrectlyAndResolvesWithStdout({
	spawnCommand,
	spawnArgs,
	spawnOptions,
	extraOptions = {},
}: {
	spawnCommand: Parameters<typeof spawn>[0]
	spawnArgs?: Parameters<typeof spawn>[1]
	spawnOptions?: Parameters<typeof spawn>[2]
	extraOptions?: Partial<Options>
}): Promise<string> {
	return ೱspawnCorrectly<string>({
		spawnCommand,
		...(spawnArgs && { spawnArgs }),
		onStdout: (result, stdoutFragment) => {
			return (result ?? "") + stdoutFragment
		},
		...(spawnOptions && { spawnOptions }),
		...(extraOptions && { extraOptions }),
	}).then((stdout) => {
		return stdout.trim() // for convenience
	})
}

/////////////////////////////////////////////////

import { spawn } from "node:child_process"

import { spawn as cross_spawn } from "cross-spawn"

import { assert } from "@monorepo-private/assert"
