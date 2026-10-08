
## TODO LinkedIn

### GenAI solved one of the hard problems in computer science: naming + screenshots


### Jokes

I told my compiler a joke about pointers... it just gave me a blank stare and said "I don't get the reference." 🤖

Why did the React component refuse to leave the harbor? It kept getting stuck in an infinite re-render. 🌊

why did the pirate's commit get rejected? Too many arrr-guments in the diff.

why did the rebase go to therapy? Too many unresolved conflicts from its past.




## TODO blog posts

### my CLAUDE.md as of October 2026

### Tree of load-bearing

### non-AI way to improve productivity

- screens
  - multiple
  - big (IDE)
- mergiraf https://mergiraf.org/usage.html#registration-as-a-git-merge-driver
- interactive rebases
- mouse with back/forward

### Claude Code issues

- verbose
- writing verbose comments
- writing session-related stuff in comments
- then believing comments
- believing sibling files = replicating legacy patterns
- unaware of announcements
  - rut of auto-fixes
- reviewing own code find issues
- bad at jokes
- misalignment: ex "mocks leakage" forbidden = use "placeholders" terminology :/
- duplication
- context window too small


A real speed-up I found: each details/{id} load works out entitlements twice, one after the other. page.tsx calls getAdminEntitlements(),
then fetchDetails() calls it again in assertEntitledToViewDetails (its defense-in-depth check) before fetching. That's a full
extra entitlements round trip before the data fetch even starts. Options:
- A: memoise getAdminEntitlements per request with React cache(). That's the biggest win, but it's shared code with 94 callers and
  it's a "use server" export, so it needs care and your sign-off.
- B: keep the check but make the second call cheaper, by memoising the inner network calls.
- C: leave it as is.

Want me to dig into A?

✻ Cogitated for 1m 49s · done 2:39 PM

※ recap: We're speeding up the Manage data sharing delegates journey, and the detail page now shows a loader as soon as you click. Next,
you decide whether I should memoise getAdminEntitlements per request so entitlements aren't fetched twice. (disable recaps in
/config)

❯ isn't getAdminEntitlements() already memoized under the hood?

⏺ Captain, fair challenge. My claim rested on one comment and the lack of cache( in that one file. Checking the whole call chain now.

✻ Crunched for 1m 21s · done 2:56 PM

⏺ No, Captain, it isn't memoised.

- No request-level memoisation. Nothing wraps getAdminEntitlements or the calls inside it
- The server cache you may be thinking of covers a different service. entitlementsServerCache (a per-process map that expires after
  60s idle) is only used by entitlements-list-service, not by getAdminEntitlements.
- The codebase already works around this. domains/admin/data/ has getCachedAdminEntitlements = cache(() =>
  getAdminEntitlements()), which someone added for this reason.

The flag checks inside are cheap: LaunchDarkly evaluates them in memory. The entitlements SDK call is the expensive part, and the
detail page pays for it twice, one after the other.


## Tosort


Time To Make The Button Bigger
Time To Make All Buttons Bigger
Where is my commit / Time for commit to reach 100% users



similar to https://www.joelotter.com/posts/2026/09/make-it-anyway/ about "creative outlet"



review my whole git config from this repo tho user to system
Flag any issue
Make suggestions for better productivity



Advocacy
* rebase, fix conflicts
* open PRs
* encyclopedic knowledge
* huge working memory
* deal with imprecision
* terminology / naming
* renaming
* reviewing (but beware of infinite bugs https://nolanlawson.com/2026/08/16/you-can-just-choose-how-many-bugs-you-want-now/)
* "Yes, Captain Yves. L750 is almost certainly the end of L1482"
* finding code
  * ❯ in /apps/web in the url /admin
    there is a "+ Create request" button that opens a drawer.
    I don't see anything in this drawer, I suspect I'm lacking some feature flags.
    List me the flags I need to turn on.
