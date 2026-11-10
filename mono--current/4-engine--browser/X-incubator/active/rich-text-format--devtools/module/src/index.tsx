import { type PropsWithChildren } from "react"

import { assert, assert_from } from "@monorepo-private/assert"
import * as RichText from "@monorepo-private/rich-text-format"
import "@monorepo-private/css--framework"
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"

import { RichTextToDebug } from "./to--debug"
import { RichTextToText } from "./to--text"
import type { BaseProps } from "./types.ts"

/////////////////////////////////////////////////

function RichTextCombinedRender({ $doc: $raw }: BaseProps) {
	console.log(`🔄 <RichTextCombinedRender>`, $raw)

	const use_hints = true
	return (
		<div
			style={{
				width: "100dvw",
			}}
		>
			<RendererWrapper name="text/basic">
				<RichTextToText $doc={$raw} rendererOptions={{ use_hints, style: "basic" }} />
			</RendererWrapper>

			<RendererWrapper name="text/markdown">
				<RichTextToText $doc={$raw} rendererOptions={{ use_hints, style: "markdown" }} />
			</RendererWrapper>

			<RendererWrapper name="debug">
				<RichTextToDebug $doc={$raw} />
			</RendererWrapper>
		</div>
	)
}

function RendererWrapper({ name, children }: { name: string } & PropsWithChildren) {
	// From http://stackoverflow.com/a/5365036/2065702
	const randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16)

	return (
		<div
			style={{
				borderTop: `3px solid ${randomColor}`,
				margin: 0,
				display: "inline-block",
				width: "30ch", // max mobile size for normal font
				minWidth: "20ch", // max mobile size for large font
				maxWidth: "60ch",
				verticalAlign: "top",
			}}
		>
			<h4>
				RichText <strong>↣</strong> {name}
			</h4>
			<div
				style={{
					border: `1px solid`,
					borderRadius: "1ch",
					textWrap: "auto",
				}}
			>
				{children}
			</div>
		</div>
	)
}

/////////////////////////////////////////////////

export { RichTextCombinedRender }
