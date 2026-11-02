/////////////////////////////////////////////////

export function renderꓽstateⵧrich_text(
	state: Immutable<any>,
	options: Immutable<Partial<Options>> = {},
): RichText.Document {
	const full_options: Immutable<Options> = {
		renderers: {},
		...options,
	}
	return _render(state, full_options)
}

/////////////////////////////////////////////////

function _render(raw_state: Immutable<any>, options: Immutable<Options>, key?: string): RichText.NodeⳇNormalized {
	const builder = RichText.fragmentⵧblock()

	const keys = new Set([...Object.keys(raw_state)])

	const type = _getꓽstate_type(raw_state)

	const $name = RichText.fragmentⵧinline()
		.pushText(Object.hasOwn(raw_state, "ⵙapp_id") ? `ᘛ ${raw_state.ⵙapp_id} ᘚ ` : "")
		.done()
	keys.delete("ⵙapp_id")

	const $schema_version = RichText.fragmentⵧinline()
		.pushText(` v${getꓽschema_versionⵧloose(raw_state)}`)
		.done()
	keys.delete("schema_version")

	builder.setHeading(
		RichText.fragmentⵧinline()
			.pushSubNodes({ $name })
			.pushText(`⟦`)
			.pushEmoji(`📦`)
			.pushText(` State of type "${type}" / `)
			.pushSubNodes({ $schema_version })
			.pushText(`⟧`)
			.done(),
	)

	const $revision = RichText.fragmentⵧinline()
		.pushText(` rev#${getꓽrevisionⵧloose(raw_state)}`)
		.done()
	keys.delete("revision")
	//.pushNode($revision)

	if (is_time_stamped(raw_state)) {
	}
	/*
	if (keys.has('last_user_investment_tms')) {
		builder.pushNode(_renderⵧWithLastUserInvestmentTimestamp(state as any))
		keys.delete('last_user_investment_tms')
	}*/

	//builder.pushNode(_renderⵧWithSchemaVersion(state as any))
	//

	//const renderer = _getꓽrendererⵧby_type(type)

	//return renderer(raw_state, options, key)

	const $remaining_keys = _renderⵧremaining_keys(raw_state, options, keys)
	builder.pushSubNodes({ $remaining_keys })

	builder.pushLineBreak()

	return builder.$node
}

/////////////////////////////////////////////////

function _getꓽstate_type(raw_state: Immutable<any>): "root" | "bundle" | "U" | "T" | "base" | "unknown" {
	switch (true) {
		// order is important!
		case isꓽRootState(raw_state):
			return "root"
		case isꓽUTBundle(raw_state):
			return "bundle"
		case isꓽUState(raw_state):
			return "U"
		case isꓽTState(raw_state):
			return "T"
		case isꓽBaseState(raw_state):
			return "base"
		// we don't go deeper (ex. isꓽWithSchemaVersion) as we'll handle those common props on everything
		default:
			return "unknown"
	}
}

/////////////////////////////////////////////////

function _renderⵧWithTimestamp(state: Immutable<WithTimestamp>, key?: string): RichText.Document {
	const builder = RichText.fragmentⵧinline()

	const d = new Date(state.timestamp_ms)
	builder.pushText(`⏲  ${getꓽUTC_timestampⵧhuman_readable‿ms(d)}`)

	return builder.done()
}

function _renderⵧWithLastUserInvestmentTimestamp(
	state: Immutable<WithLastUserInvestmentTimestamp>,
	key?: string,
): RichText.Document {
	const builder = RichText.fragmentⵧinline()

	const d = new Date(state.last_user_investment_tms)
	builder.pushText(`⏲  ${getꓽUTC_timestampⵧhuman_readable‿ms(d)}`)

	return builder.done()
}

/////////////////////////////////////////////////

function _getꓽrendererⵧby_type(type: ReturnType<typeof _getꓽstate_type>): Renderer {
	switch (type) {
		case "root":
			return _renderⵧRootState

		case "bundle":
			return _renderⵧUTBundle

		case "U":
			return _renderⵧUState

		case "T":
			return _renderⵧTState

		case "base":
			return _renderⵧBaseState

		default:
			return _renderⵧany
	}
}

function _renderⵧRootState(state: Immutable<BaseRootState>, options: Options, key?: string): RichText.Document {
	assert(!key, `root should be root! "${key}"`)

	const builder = RichText.fragmentⵧblock()

	const keys = new Set([...Object.keys(state)])
	keys.delete("u_state")
	keys.delete("t_state")
	keys.delete("schema_version") // handled in generic code
	keys.delete("revision") // handled in generic code

	builder.setHeading(`ᘛ ${state.ⵙapp_id} ᘚ`)
	keys.delete("ⵙapp_id")

	const $kvⵧown = RichText.listⵧunordered().assemble((builder) => {
		keys.forEach((k) => {
			builder.pushKeyValue(k, (state as any)[k])
		})
	})
	builder.pushSubNodes({ $kvⵧown })

	//builder.pushHorizontalRule()

	const subkeys = new Set<string>([...Object.keys(state.u_state), ...Object.keys(state.t_state)])
	subkeys.delete("revision")
	subkeys.delete("schema_version")
	subkeys.delete("timestamp_ms")
	subkeys.forEach((k) => {
		const u = (state.u_state as any)[k] as BaseUState | undefined
		const t = (state.t_state as any)[k] as BaseTState | undefined

		//console.log({ u: !!u, t: !!t })
		const $node = t ? _render([u, t] as any, options, k) : _render(u!, options, k)
		$node.$heading = `{${NORMALIZERS["capitalizeⵧfirst"]!(k)}}`
		builder.pushSubNode($node)
	})

	return builder.done()
}

function _renderⵧUTBundle(state: Immutable<UTBundle>, options: Options, key?: string): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	builder.setHeading("TODO _renderⵧUTBundle!")

	return builder.done()
}

function _renderⵧUState(state: Immutable<BaseUState>, options: Immutable<Options>, key?: string): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	const keys = new Set([...Object.keys(state)])
	/*
	builder.pushNode(_renderⵧWithSchemaVersion(state as any))
	builder.pushLineBreak()
	keys.delete('schema_version')

	builder.pushNode(_renderⵧWithRevision(state as any))
	builder.pushLineBreak()
	keys.delete('revision')*/

	const renderedⵧdedicated = _getꓽrendererⵧdedicated("U", options, key)
	const remaining_keys = renderedⵧdedicated
		? renderedⵧdedicated(state, options, key)
		: _renderⵧremaining_keys(state, options, keys)
	builder.pushSubNode(remaining_keys, { id: "remaining" })

	return builder.done()
}

function _renderⵧTState(state: Immutable<UTBundle>, options: Options, key?: string): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	builder.setHeading("TODO _renderⵧTState!")

	return builder.done()
}

function _renderⵧBaseState(state: Immutable<UTBundle>, options: Options, key?: string): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	builder.setHeading("TODO _renderⵧBaseState!")

	return builder.done()
}

function _renderⵧany(state: Immutable<any>, options: Options, key?: string): RichText.Document {
	const builder = RichText.fragmentⵧblock()

	builder.setHeading("TODO _renderⵧany!")

	return builder.done()
}

function _renderⵧremaining_keys(state: Immutable<any>, options: Options, keys: Set<string>): RichText.Document {
	const builder = RichText.listⵧunordered()

	Array.from(keys.keys()).forEach((k) => {
		let raw = (state as any)[k]
		let v = toꓽstring(raw)
		if (v.length > 80) v = v.slice(0, 80) + "…"

		builder.pushKeyValue(k, v)
		//builder.pushKeyValue(k, JSON.stringify((state as any)[k]))
	})

	return builder.done()
}

/////////////////////////////////////////////////

type Renderer = (raw_state: Immutable<any>, options: Immutable<Options>, key?: string) => RichText.Document

interface Options {
	renderers: {
		[k: string]: Renderer
	}
}

function _getꓽrendererⵧdedicated(
	type: ReturnType<typeof _getꓽstate_type>,
	options: Immutable<Options>,
	key?: string,
): Renderer | undefined {
	let candidate = `${type}:${key}`
	if (options.renderers[candidate]) return options.renderers[candidate]!

	candidate = `${key}`
	if (options.renderers[candidate]) return options.renderers[candidate]!

	candidate = `${type}`
	if (options.renderers[candidate]) return options.renderers[candidate]!

	return undefined
}

/////////////////////////////////////////////////

import { assert_from, assert } from "@monorepo-private/assert"
import * as NORMALIZERS from "@monorepo-private/normalize-string"
import type {
	WithRevision,
	WithTimestamp,
	WithLastUserInvestmentTimestamp,
	BaseRootState,
	UTBundle,
	BaseUState,
	BaseTState,
} from "@monorepo-private/offirmo-state"
import {
	is_time_stamped,
	getꓽschema_versionⵧloose,
	getꓽrevisionⵧloose,
	isꓽBaseState,
	isꓽUState,
	isꓽTState,
	isꓽUTBundle,
	isꓽRootState,
} from "@monorepo-private/offirmo-state"
import * as RichText from "@monorepo-private/rich-text-format"
import { getꓽUTC_timestampⵧhuman_readable‿ms } from "@monorepo-private/timestamps"
import type { Immutable } from "@monorepo-private/ts--types"
import { toꓽstring } from "@monorepo-private/ts--utils"
