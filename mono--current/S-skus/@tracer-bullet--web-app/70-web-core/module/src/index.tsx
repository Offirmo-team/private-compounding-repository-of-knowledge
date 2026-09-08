export function App() {
	return (
		<div>
			<BackgroundImg bg={BG} _debug={true} />
			<div>Hello, world!</div>
		</div>
	)
}

/////////////////////////////////////////////////

import { BG } from "@monorepo-private/assets--background/mono--current/LisadiKaprio/sunny-sky"
import { BackgroundImg } from "@monorepo-private/react--background-img"
