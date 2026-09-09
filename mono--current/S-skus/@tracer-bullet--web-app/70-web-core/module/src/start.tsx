// TODO move into a pkg? or generator template?

import { Fragment, StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
//import { Agentation } from 'agentation' // https://agentation.dev/install

import { ೱᐧpage_loaded } from "@monorepo-private/page-loaded"
import ErrorBoundary from "@monorepo-private/react--error-boundary"
import { getRootSXC } from "@monorepo-private/soft-execution-context"
import { schedule_when_idle_but_within_human_perception } from "@monorepo-private/utils--async"

import { Root } from "./root.tsx"

/////////////////////////////////////////////////

async function init(): Promise<void> {
	getRootSXC().xTry("view", async ({ logger, SXC, CHANNEL }) => {
		// reminder: we assume there is a beautiful loader which started synchronously, so no rush
		console.log("🔄 scheduling React start later…")
		await ೱᐧpage_loaded

		await schedule_when_idle_but_within_human_perception(() => {
			console.log("🔄 now starting view with react…")

			const root‿elt = (() => {
				let candidate = document.getElementById("react-root")
				if (candidate) return candidate

				return document.body
			})()

			const OptionalStrictCheck = CHANNEL === "dev" ? StrictMode : Fragment

			const root = createRoot(root‿elt)

			root.render(
				<>
					<OptionalStrictCheck>
						<ErrorBoundary name={`reactᐧroot`} SXC={SXC}>
							<Suspense fallback={<span>Loading data…</span>}>
								<Root />
							</Suspense>
						</ErrorBoundary>
					</OptionalStrictCheck>
					{/*CHANNEL === 'dev' && <Agentation />*/}
				</>,
			)
		})
	})
}

/////////////////////////////////////////////////

export { init }
