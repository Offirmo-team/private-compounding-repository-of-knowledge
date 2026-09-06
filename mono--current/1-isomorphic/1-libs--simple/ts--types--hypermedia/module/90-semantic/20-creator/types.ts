/////////////////////////////////////////////////

export interface Creator extends Partial<WithOnlinePresence> {
	name: ContentⳇPublicName
	intro?: ContentⳇMiniBio

	// [inherited]  urlⵧcanonical: Url‿str
	// [inherited]  urlsⵧsocial

	email?: Email‿str
	contact?: Url‿str // should NOT duplicate email
	since‿y?: Year // for copyright notice
}

/////////////////////////////////////////////////

import type { Year } from "@monorepo-private/ts--types"

import type { ContentⳇMiniBio, ContentⳇPublicName } from "../../00-base/index.ts"
import type { Url‿str } from "../../01-links/index.ts"
import type { Email‿str } from "../../02-links--email/index.ts"
import type { WithOnlinePresence } from "../10-with-online-presence/types.ts"
