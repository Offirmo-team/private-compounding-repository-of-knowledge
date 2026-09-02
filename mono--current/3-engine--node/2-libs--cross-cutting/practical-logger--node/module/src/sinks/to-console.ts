import chalk from "chalk"

import { injectꓽlibꓽchalk, prettifyꓽany } from "@monorepo-private/prettify-any"
import { displayError } from "@monorepo-private/print-error-to-terminal"

injectꓽlibꓽchalk(chalk)

import type { LogPayload, LogSink } from "@monorepo-private/practical-logger--types"

import type { SinkOptions } from "../types.ts"

import { LEVEL_TO_ASCII, LEVEL_TO_STYLIZE } from "./common.ts"

export function createSink(options: Readonly<SinkOptions> = {}): LogSink {
	const displayTime = options.displayTime || false

	return (payload: LogPayload): void => {
		const { level, name, msg, time, details, err } = payload

		let line = [
			displayTime ? chalk.dim(String(time)) : "",
			LEVEL_TO_ASCII[level] + "›",
			LEVEL_TO_STYLIZE[level]([name, msg].filter((x) => !!x).join("› ")),
			Reflect.ownKeys(details).length === 0
				? ""
				: prettifyꓽany(details, {
						eol: "",
						should_sort_keys: true,
					}),
		]
			.filter((x) => !!x)
			.join(" ")

		console.log(line) // eslint-disable-line no-console
		if (err) displayError(err)
	}
}

export default createSink
