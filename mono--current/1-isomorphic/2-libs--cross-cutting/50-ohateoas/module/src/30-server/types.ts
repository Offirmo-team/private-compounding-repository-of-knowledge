import type { Immutable, Story } from "@monorepo-private/ts--types"

import type { OHAHyperMedia, OHAHyperLink, OHAHyperAction } from "../01-types/types.ts"

/////////////////////////////////////////////////

interface OHAServer {
	// inspired by GET, POST, PUT, DELETE https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
	// also QUERY https://www.ietf.org/archive/id/draft-ietf-httpbis-safe-method-w-body-05.html

	// the base one, return a HATEOAS hypermedia representation including hyperlinks/actions
	// should always respond to '/' as a starting point of the rsrc discovery
	ↆget(url?: OHAHyperLink["href"]): Promise<OHAHyperMedia> // the returned resource representation should contain everything needed to move forward

	// dispatch an action
	dispatch(
		action: Immutable<OHAHyperAction>,
		url?: OHAHyperLink["href"], // the action target rsrc, defaulting to '/'
	): Promise<
		// Must be a "can-be-lost" feedback, for ex. "ticket created" or "action acknowledged"
		// REMINDER that the action itself has a "feedback" that will be played while waiting for the result
		| Story<OHAHyperMedia>
		// A response may not be needed, for ex. sending a mail or simple button click (in this case, the action's feedback "tracking" should have said so)
		| undefined
	>
	// NOTES:
	// - the whole point of an action is to change the state of the system, so we should assume a representation update will be needed (or else why not a link?)
	// - we must assume the response can be lost, thus if critical we must store the "result story" as pending engagements
	//   ex. a game where an action triggers an important cutscene:
	//   - in case of crash/disconnection and the player lose a very important story development. (happened to me in Ultima IX with crashing vids btw)
	//   = we must ensure it has been seen/processed by the player

	// TODO 1D push = server-initiated updates (bg sync, collab, multi-tabs...)
	// ping a browser? a URL?
}

/////////////////////////////////////////////////

export { type OHAServer }
