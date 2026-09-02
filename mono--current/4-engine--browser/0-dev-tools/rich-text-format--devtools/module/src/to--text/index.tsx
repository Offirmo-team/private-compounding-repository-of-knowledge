import { assert, assert_from } from "@monorepo-private/assert"
import * as RichText from "@monorepo-private/rich-text-format"
import { renderⵧto_text, type RenderingOptionsⵧToText } from "@monorepo-private/rich-text-format--to-textual"
//import { x } from '@monorepo-private/rich-text-format--to-textual'
import type { Immutable, PositiveInteger } from "@monorepo-private/ts--types"
import "@monorepo-private/css--framework"

import type { BaseProps } from "../types.ts"

/////////////////////////////////////////////////

interface Props extends BaseProps {
	rendererOptions?: Partial<RenderingOptionsⵧToText>
}

function RichTextToText({ $doc, rendererOptions = {} }: Props) {
	console.log(`🔄 <RichTextToText>`, $doc)

	return <pre>{renderⵧto_text($doc, rendererOptions).trim()}</pre>
}

/////////////////////////////////////////////////

export { RichTextToText }
