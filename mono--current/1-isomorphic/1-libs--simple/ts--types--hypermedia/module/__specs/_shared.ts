import { strict as assert } from "node:assert"

import { expect } from "chai"

import { normalizeꓽemailⵧreasonable, normalize_unicode } from "@monorepo-private/normalize-string"
import type {
	Author,
	Email‿str,
	SocialNetworkId,
	SocialNetworkLink,
	Url‿str,
	WithOnlinePresence,
} from "@monorepo-private/ts--types--hypermedia"

/////////////////////////////////////////////////

export function expectㆍtoㆍbeㆍaㆍvalidㆍUrl‿str(url: Url‿str, msg: string): void {
	assert(typeof url === "string", `${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍUrl‿str -- should be a string!`)
	expect(() => new URL(url), `${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍUrl‿str -- should be parseable by URL()!`).not.to
		.throw
	expect(
		normalize_unicode(url).trim(),
		`${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍUrl‿str -- should be normalized!`,
	).to.equal(url)
}

export function expectㆍtoㆍbeㆍaㆍvalidㆍSocialNetworkLink(snl: SocialNetworkLink, msg: string): void {
	expectㆍtoㆍbeㆍaㆍvalidㆍUrl‿str(snl.url, `${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍSocialNetworkLink`)
	expect(
		typeof snl.network === "string",
		`${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍSocialNetworkLink -- .url should be a Url‿str!`,
	)
	if (snl.handle) {
		expect(
			snl.url.endsWith(snl.handle),
			`${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍSocialNetworkLink -- url should end with handle!`,
		)
	}
}

export function expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence(wop: WithOnlinePresence, msg: string): void {
	expectㆍtoㆍbeㆍaㆍvalidㆍUrl‿str(
		wop.urlⵧcanonical,
		`${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence -- .url should be a Url‿str!`,
	)
	wop.urlsⵧsocial?.forEach((snl) =>
		expectㆍtoㆍbeㆍaㆍvalidㆍSocialNetworkLink(snl, `${msg} -- expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence`),
	)
}

export function expectㆍtoㆍbeㆍaㆍvalidㆍAuthor(author: Author): void {
	expectㆍtoㆍbeㆍaㆍvalidㆍWithOnlinePresence(author, "expectㆍtoㆍbeㆍaㆍvalidㆍAuthor")
	if (author.email) {
		expect(
			normalizeꓽemailⵧreasonable(author.email),
			`expectㆍtoㆍbeㆍaㆍvalidㆍAuthor -- normalizeꓽemailⵧreasonable`,
		).to.equal(author.email)
	}
}
