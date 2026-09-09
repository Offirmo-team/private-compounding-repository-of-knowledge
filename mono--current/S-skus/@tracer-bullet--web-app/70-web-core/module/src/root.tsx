/////////////////////////////////////////////////

export interface Props {
	_debug?: boolean
}

export function Root(props: Props) {
	return (
		<div className="o⋄full-viewport isolate" style={{ position: "relative" }}>
			<BackgroundImg bg={BG} _debug={!!props._debug} />
			<div className="o⋄usable-viewport" style={{ position: "relative" }}>
				<pre className="o⋄bg-colorꘌtransparent">Hello, world!</pre>
			</div>
		</div>
	)
}

/////////////////////////////////////////////////

import { BG } from "@monorepo-private/assets--background/LisadiKaprio/sunny-sky"
import { BackgroundImg } from "@monorepo-private/react--background-img"
