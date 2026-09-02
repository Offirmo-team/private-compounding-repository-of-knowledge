import { use, useMemo } from "react"

import { assert_from } from "@monorepo-private/assert"
import "@monorepo-private/css--framework"
import { BackgroundImg } from "@monorepo-private/react--background-img"

/////////////////////////////////////////////////

export interface Props {}

export function Root(props: Props) {
	console.log("🔄 <Root/>", props)

	return <>Hello, world!</>
}

/////////////////////////////////////////////////
