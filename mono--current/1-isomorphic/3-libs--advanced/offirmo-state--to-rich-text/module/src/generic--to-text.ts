/////////////////////////////////////////////////

export function renderꓽstateⵧprettified_text(state: Immutable<Object>): string {
	const options = getꓽoptionsⵧfull()

	const _prettifyꓽobjectⵧkeyⳇvalue = options.prettifyꓽobjectⵧkeyⳇvalue

	options.prettifyꓽobjectⵧkeyⳇvalue = function prettifyꓽobjectⵧkeyⳇvalue(obj: Object, st: State): string[] {
		let { o } = st

		if (!isꓽWithSchemaVersion(obj)) {
			return _prettifyꓽobjectⵧkeyⳇvalue(obj, st)
		}

		const { ⵙapp_id, schema_version, revision, last_user_investment_tms, timestamp_ms, ...rest } = obj as any

		let header: string[] = []
		if (ⵙapp_id) {
			header.push("" + "ᘛ" + o.stylizeꓽglobal(ⵙapp_id) + "ᘚ")
		}
		if (revision !== undefined) {
			header.push("" + "rev#" + o.stylizeꓽglobal(revision))
		}
		if (last_user_investment_tms !== undefined) {
			const d = new Date(last_user_investment_tms)
			header.push("" + "⏲" + o.stylizeꓽglobal(getꓽUTC_timestampⵧhuman_readable‿ms(d)))
		}
		if (timestamp_ms !== undefined) {
			const d = new Date(timestamp_ms)
			header.push("" + "⏲" + o.stylizeꓽglobal(getꓽUTC_timestampⵧhuman_readable‿ms(d)))
		}
		if (schema_version !== undefined) {
			header.push("" + "ⓥ " + o.stylizeꓽglobal(schema_version))
		}
		assert(header.length, `header length!`)

		st = {
			...st,
			o: {
				...st.o,
				should_compact_objects: false,
			},
		}
		const lines = _prettifyꓽobjectⵧkeyⳇvalue(rest, st)
		return [[lines[0], o.stylizeꓽdim("/*"), ...header, o.stylizeꓽdim("*/")].join(" "), ...lines.slice(1)]
	}

	return prettifyꓽjson(state, options)
}

/////////////////////////////////////////////////

import assert from "tiny-invariant"

import { isꓽWithSchemaVersion } from "@monorepo-private/offirmo-state"
import { type State, prettifyꓽjson, getꓽoptionsⵧfull } from "@monorepo-private/prettify-any"
import { getꓽUTC_timestampⵧhuman_readable‿ms } from "@monorepo-private/timestamps"
import type { Immutable } from "@monorepo-private/ts--types"
