import type { Url‿str } from "../../01-links/index.ts"
import type { WithOnlinePresence } from "../10-with-online-presence/types.ts"
import type { Thing } from "../30-thing/types.ts"

/////////////////////////////////////////////////

export interface ThingWithOnlinePresence extends Thing, WithOnlinePresence {
	urlⵧcanonical: Url‿str // [needed for extends resolution]

	contact?: Url‿str // if not provided, default to author's if any. Ideally should be a "contact center" https://docs.aws.amazon.com/connect/latest/adminguide/connect-concepts.html
	contactⵧsecurity?: Url‿str // if not provided, default to contact
	contactⵧsupport?: Url‿str // if not provided, default to contact
}
