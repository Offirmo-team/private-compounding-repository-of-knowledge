## TODO LinkedIn

review in NEW session

### Web formats

https://jakearchibald.com/2026/jpeg-xl-vs-avif/

### Jokes

I told my compiler a joke about pointers... it just gave me a blank stare and
said "I don't get the reference." 🤖

Why did the React component refuse to leave the harbor? It kept getting stuck
in an infinite re-render. 🌊

why did the pirate's commit get rejected? Too many arrr-guments in the diff.

why did the rebase go to therapy? Too many unresolved conflicts from its past.

Why did the empty folder see a therapist? Nobody would track it, and all it had
left was baggage it had been told to ignore.

Why did the SSH key break up with the password? It needed a relationship with
less exposure.

Why did the pirate's PR get rejected? Too many arrr-guments in one function.

## TODO blog posts

#ai #claudecode #devtools #programming

- https://refactoringenglish.com/blog/anti-patterns-software-blogging/

### environment for CC

bash, jq etc.


⏺ The cause is simple: typescript-language-server isn't installed. It's not on your PATH, not among your mise installs, and nowhere else on disk. The Claude Code TypeScript LSP
  plugin only uses the binary; it doesn't install it.

  Node itself is fine (mise, node 26.13.0). Your global mise config at ~/.config/mise/config.toml is a plain local file, not a symlink to your dev-env repo, so the clean fix is
  to add the server there the same way you already handle npm:skills:

  mise use -g npm:typescript-language-server@latest \
    npm:typescript@6

  - typescript is its required peer. It uses the repo's node_modules/typescript when it finds one and falls back to the global install otherwise.
  - After that, restart Claude Code: the plugin only tries to start the server when a session begins. Your PATH already includes the mise shims directory, so it should find the
    binary once it's installed.

  If you don't want the LSP at all, disable plugin:typescript-lsp instead.

  This changes your global config, which is outside this repo, so I haven't run it. Want me to?

  1. In this repo it'll work. typescript-language-server uses the workspace TypeScript first, and the repo's node_modules/typescript is 6.0.3 with lib/tsserver.js present.
  2. 🟠 The global fallback is broken. Global typescript@latest installed 7.0.2, and that package has no tsserver.js. In any folder without its own TypeScript, the server would
     start and then fail. Pin the global copy to 6:

  mise use -g npm:typescript@6

### Testing for Firefox is Cargo Culting

The point is, if we want to test for browser coverage, It should be, in order:
Chrome latest Chrome N-1 Safari Edge Firefox I'm sure the education sector also
has Chrome.

### TODO my CLAUDE.md as of October 2026

### TODO help Claude

latest bash fd etc.

TODO claude invocation

GNU/Linux habits by default, corrected when I notice I'm on macOS.

  - Instinct: most shell examples I learned from are Linux (CI, Docker, servers, Stack Overflow). So the commands I reach for first are
  - 

## Claude Code hooks spawn node dozens of times per tool call; via mise shims each spawn waits ~0.13s on endpoint security,

## so put mise's real bin dirs first. Gotcha: tool versions are resolved once, for the directory claude is launched from.

claude() {

## 1. Claude complains when running in zsh, prefers bash

## 2. default macOS bash is old (as of 226/11 v3 vs v5)

## 3. Claude internally uses the default shell or $SHELL (checked as of 2026/11)

echo "[claude] current shell: ${BASH_VERSION:+bash
$BASH_VERSION}${ZSH_VERSION:+zsh $ZSH_VERSION}" >&2

if command -v brew >/dev/null 2>&1; then _claude_bash="$(brew
--prefix)/bin/bash" else _claude_bash="" fi

if [ ! -x "$_claude_bash" ]; then _claude_bash="$(command -v bash)" echo
"[claude] Homebrew Bash not found; using default $_claude_bash" >&2 else echo
"[claude] using modern Homebrew Bash: $_claude_bash" >&2 fi

## Resolve mise-managed tools once for the directory Claude is launched from,

## bypassing mise shims for subsequent hook/tool invocations.

_claude_path="$(mise bin-paths 2>/dev/null | tr '\n' ':')$PATH"

echo "[claude] shell: $_claude_bash" >&2 echo "[claude] claude:
$(PATH="$_claude_path" command -v claude)" >&2 echo "[claude] node:
$(PATH="$_claude_path" command -v node)" >&2

PATH="$_claude_path" \
SHELL="$_claude_bash" \
command claude "$@" }

### TODO Tree of load-bearing

onion / hexagonal UI as a leaf

### non-AI way to improve productivity

- screens
  - multiple
  - one big (IDE) high dynamic/refresh
- mergiraf https://mergiraf.org/usage.html#registration-as-a-git-merge-driver
- interactive rebases
- mouse with back/forward
- RAM
- ad blocker
- tree tabs

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
- misalignment: ex "mocks leakage" forbidden = use "placeholders" terminology
  :/
- duplication
- context window too small

```
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
```

### new SWE metrics

Time To Make The Button Bigger Time To Make All Buttons Bigger Where is my
commit / Time for commit to reach 100% users

### beyond "load bearing"

terms from "architecture and structural engineering" with good wisdom for
software engineers

### evolution of SWE

-

## Tosort

similar to https://www.joelotter.com/posts/2026/09/make-it-anyway/ about
"creative outlet"

review my whole git config from this repo tho user to system Flag any issue
Make suggestions for better productivity

inspect my zsh and bash config files (I use both) review and make suggestions
for correctness and speed (my shells are a bit slow to start)

inspect my Claude Code setup especially the hooks and plugins and tell me if
there is sth to clean or incorrect

### Coding LLM Advocacy

- rebase, fix conflicts
- open PRs
- infinite polite StackOverflow
- encyclopedic knowledge
- huge working memory
- deal with imprecision
- terminology / naming
- renaming
- reviewing (but beware of infinite bugs
  https://nolanlawson.com/2026/08/16/you-can-just-choose-how-many-bugs-you-want-now/)
- "Yes, Captain. L750 is almost certainly the end of L1482"
- finding code
  - ❯ in /apps/web in the url /admin there is a "+ Create request" button that
    opens a drawer. I don't see anything in this drawer, I suspect I'm lacking
    some feature flags. List me the flags I need to turn on.




## TOSORT

infantile
- forced mandatory fields

Feedback

If your boss asks tomorrow to reduce headcount by 30%, would you keep X? Why
