/////////////////////////////////////////////////

export interface WithOnlinePresence {
	urlⵧcanonical: Url‿str
	urlsⵧsocial?: SocialNetworkLink[] // array because it conveys the Author's preference, earlier = preferred
}

/////////////////////////////////////////////////

import type { Url‿str, SocialNetworkLink } from "../../01-links/index.ts"
