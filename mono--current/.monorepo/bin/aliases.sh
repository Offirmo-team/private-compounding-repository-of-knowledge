#@IgnoreInspection BashAddShebang
[[ "$VERBOSE__RC" == true ]] && echo "$(date +%H:%M:%S)   ↳ […monorepo/…/aliases.sh] hello!" >&2

## default = where "gitc" is supposed to clone it
export MONOREPO_ROOT__CURRENT=${PCRK_ROOT:-"$HOME/work/src/x-external/off/offirmo-team/private-compounding-repository-of-knowledge/mono--current/"};

### 0-meta/
alias  mono.@monorepo-private.config--mocha='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 0-meta/config--mocha/; tabset --badge "@monorepo-private/config--mocha"'
alias  mono.@monorepo-private.config--typescript='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 0-meta/config--typescript/; tabset --badge "@monorepo-private/config--typescript"'
alias  mono.@monorepo-private.scripts='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 0-meta/scripts/; tabset --badge "@monorepo-private/scripts"'

### 1-isomorphic/1-libs--simple/
alias  mono.@monorepo-private.assert='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/0-assert/; tabset --badge "@monorepo-private/assert"'
alias  mono.@monorepo-private.freeze='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/0-freeze/; tabset --badge "@monorepo-private/freeze"'
alias  mono.@monorepo-private.normalize-string='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-normalize-string/; tabset --badge "@monorepo-private/normalize-string"'
alias  mono.@monorepo-private.poll='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-poll/; tabset --badge "@monorepo-private/poll"'
alias  mono.@monorepo-private.promise-try='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-promise-try/; tabset --badge "@monorepo-private/promise-try"'
alias  mono.@monorepo-private.random='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-random/; tabset --badge "@monorepo-private/random"'
alias  mono.@monorepo-private.set-deep-property='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-set-deep-property/; tabset --badge "@monorepo-private/set-deep-property"'
alias  mono.@monorepo-private.timestamps='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-timestamps/; tabset --badge "@monorepo-private/timestamps"'
alias  mono.@monorepo-private.ts--types='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-ts--types/; tabset --badge "@monorepo-private/ts--types"'
alias  mono.@monorepo-private.type-detection='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/1-type-detection/; tabset --badge "@monorepo-private/type-detection"'
alias  mono.@monorepo-private.gravatar='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/gravatar/; tabset --badge "@monorepo-private/gravatar"'
alias  mono.@monorepo-private.json-stable-stringify='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/json-stable-stringify/; tabset --badge "@monorepo-private/json-stable-stringify"'
alias  mono.@monorepo-private.marketing--creator='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/marketing--creator/; tabset --badge "@monorepo-private/marketing--creator"'
alias  mono.@monorepo-private.merge='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/merge/; tabset --badge "@monorepo-private/merge"'
alias  mono.@monorepo-private.murmurhash='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/murmurhash/; tabset --badge "@monorepo-private/murmurhash"'
alias  mono.@monorepo-private.ts--types--hypermedia='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/ts--types--hypermedia/; tabset --badge "@monorepo-private/ts--types--hypermedia"'
alias  mono.@monorepo-private.ts--utils='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/ts--utils/; tabset --badge "@monorepo-private/ts--utils"'
alias  mono.@monorepo-private.unicode-data='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/unicode-data/; tabset --badge "@monorepo-private/unicode-data"'
alias  mono.@monorepo-private.url='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/url/; tabset --badge "@monorepo-private/url"'
alias  mono.@monorepo-private.utils--async='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/utils--async/; tabset --badge "@monorepo-private/utils--async"'
alias  mono.@monorepo-private.utils--error='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/utils--error/; tabset --badge "@monorepo-private/utils--error"'
alias  mono.@monorepo-private.utils--sort='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/utils--sort/; tabset --badge "@monorepo-private/utils--sort"'
alias  mono.@monorepo-private.uuid='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/1-libs--simple/uuid/; tabset --badge "@monorepo-private/uuid"'

### 1-isomorphic/2-libs--cross-cutting/
alias  mono.@monorepo-private.practical-logger--types='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/10-practical-logger--types/; tabset --badge "@monorepo-private/practical-logger--types"'
alias  mono.@monorepo-private.practical-logger--core='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/11-practical-logger--core/; tabset --badge "@monorepo-private/practical-logger--core"'
alias  mono.@monorepo-private.practical-logger--minimal-noop='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/12-practical-logger--minimal-noop/; tabset --badge "@monorepo-private/practical-logger--minimal-noop"'
alias  mono.@monorepo-private.universal-debug-api--types='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/20-universal-debug-api--types/; tabset --badge "@monorepo-private/universal-debug-api--types"'
alias  mono.@monorepo-private.universal-debug-api--placeholder='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/21-universal-debug-api--placeholder/; tabset --badge "@monorepo-private/universal-debug-api--placeholder"'
alias  mono.@monorepo-private.soft-execution-context='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/30-soft-execution-context/; tabset --badge "@monorepo-private/soft-execution-context"'
alias  mono.@monorepo-private.rich-text-format--core='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/40-rich-text-format--core/; tabset --badge "@monorepo-private/rich-text-format--core"'
alias  mono.@monorepo-private.rich-text-format--to-textual='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/41-rich-text-format--to-textual/; tabset --badge "@monorepo-private/rich-text-format--to-textual"'
alias  mono.@monorepo-private.rich-text-format--builder='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/42-rich-text-format--builder/; tabset --badge "@monorepo-private/rich-text-format--builder"'
alias  mono.@monorepo-private.rich-text-format='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/49-rich-text-format/; tabset --badge "@monorepo-private/rich-text-format"'
alias  mono.@monorepo-private.credits='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/2-libs--cross-cutting/credits/; tabset --badge "@monorepo-private/credits"'

### 1-isomorphic/3-libs--advanced/
alias  mono.@monorepo-private.better-console-groups='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/3-libs--advanced/better-console-groups/; tabset --badge "@monorepo-private/better-console-groups"'
alias  mono.@monorepo-private.flux='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/3-libs--advanced/flux/; tabset --badge "@monorepo-private/flux"'
alias  mono.@monorepo-private.offirmo-state='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/3-libs--advanced/offirmo-state/; tabset --badge "@monorepo-private/offirmo-state"'
alias  mono.@monorepo-private.sync-store='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/3-libs--advanced/sync-store/; tabset --badge "@monorepo-private/sync-store"'

### 1-isomorphic/X-incubator/active/
alias  mono.@monorepo-private.ohateoas='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/X-incubator/active/50-ohateoas/; tabset --badge "@monorepo-private/ohateoas"'
alias  mono.@monorepo-private.data-structures='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/X-incubator/active/data-structures/; tabset --badge "@monorepo-private/data-structures"'
alias  mono.@monorepo-private.http-client='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/X-incubator/active/http-client/; tabset --badge "@monorepo-private/http-client"'
alias  mono.@monorepo-private.offirmo-state--to-rich-text='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/X-incubator/active/offirmo-state--to-rich-text/; tabset --badge "@monorepo-private/offirmo-state--to-rich-text"'
alias  mono.@monorepo-private.visual-identity='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 1-isomorphic/X-incubator/active/visual-identity/; tabset --badge "@monorepo-private/visual-identity"'

### 2-engine--winter/
alias  mono.@monorepo-private.prettify-any='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 2-engine--winter/prettify-any/; tabset --badge "@monorepo-private/prettify-any"'

### 3-engine--node/1-libs--simple/
alias  mono.@monorepo-private.file-entry='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/file-entry/; tabset --badge "@monorepo-private/file-entry"'
alias  mono.@monorepo-private.fs--better-write-file='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/fs--better-write-file/; tabset --badge "@monorepo-private/fs--better-write-file"'
alias  mono.@monorepo-private.fs--ls='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/fs--ls/; tabset --badge "@monorepo-private/fs--ls"'
alias  mono.@monorepo-private.fs--parent='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/fs--parent/; tabset --badge "@monorepo-private/fs--parent"'
alias  mono.@monorepo-private.load-config='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/load-config/; tabset --badge "@monorepo-private/load-config"'
alias  mono.@monorepo-private.print-error-to-terminal='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/print-error--to-terminal/; tabset --badge "@monorepo-private/print-error-to-terminal"'
alias  mono.@monorepo-private.read-write-any-structured-file='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/read-write-any-structured-file/; tabset --badge "@monorepo-private/read-write-any-structured-file"'
alias  mono.@monorepo-private.spawn-correctly='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/1-libs--simple/spawn-correctly/; tabset --badge "@monorepo-private/spawn-correctly"'

### 3-engine--node/2-libs--cross-cutting/
alias  mono.@monorepo-private.practical-logger--node='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/2-libs--cross-cutting/practical-logger--node/; tabset --badge "@monorepo-private/practical-logger--node"'
alias  mono.@monorepo-private.rich-text-format--to-terminal='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/2-libs--cross-cutting/rich-text-format--to-terminal/; tabset --badge "@monorepo-private/rich-text-format--to-terminal"'
alias  mono.@monorepo-private.soft-execution-context--node='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/2-libs--cross-cutting/soft-execution-context--node/; tabset --badge "@monorepo-private/soft-execution-context--node"'
alias  mono.@monorepo-private.universal-debug-api--node='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/2-libs--cross-cutting/universal-debug-api--node/; tabset --badge "@monorepo-private/universal-debug-api--node"'

### 3-engine--node/3-libs--advanced/
alias  mono.@monorepo-private.state-migration-tester='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/3-libs--advanced/offirmo-state-migration-tester/; tabset --badge "@monorepo-private/state-migration-tester"'

### 3-engine--node/X-incubator/active/
alias  mono.@monorepo-private.ohateoas-browser--terminal='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/X-incubator/active/ohateoas-browser--terminal/; tabset --badge "@monorepo-private/ohateoas-browser--terminal"'
alias  mono.@monorepo-private.tui='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 3-engine--node/X-incubator/active/tui/; tabset --badge "@monorepo-private/tui"'

### 4-engine--browser/0-dev-tools/
alias  mono.@monorepo-private.css--utils--diagnostics='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/0-dev-tools/css--utils--diagnostics/; tabset --badge "@monorepo-private/css--utils--diagnostics"'
alias  mono.@monorepo-private.decisions='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/0-dev-tools/decisions/; tabset --badge "@monorepo-private/decisions"'
alias  mono.@monorepo-private.engine--browser--types='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/0-dev-tools/engine--browser--types/; tabset --badge "@monorepo-private/engine--browser--types"'
alias  mono.@monorepo-private.vite--config--default='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/0-dev-tools/vite--config--default/; tabset --badge "@monorepo-private/vite--config--default"'
alias  mono.@monorepo-private.vite-plugin-parcel-features='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/0-dev-tools/vite-plugin-parcel-features/; tabset --badge "@monorepo-private/vite-plugin-parcel-features"'

### 4-engine--browser/1-libs--simple/
alias  mono.@monorepo-private.browser-features-detection='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/browser-features-detection/; tabset --badge "@monorepo-private/browser-features-detection"'
alias  mono.@monorepo-private.css--reset='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/css--0-reset/; tabset --badge "@monorepo-private/css--reset"'
alias  mono.@monorepo-private.css--foundation='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/css--1-foundation/; tabset --badge "@monorepo-private/css--foundation"'
alias  mono.@monorepo-private.css--framework='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/css--2-framework/; tabset --badge "@monorepo-private/css--framework"'
alias  mono.@monorepo-private.page-loaded='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/page-loaded/; tabset --badge "@monorepo-private/page-loaded"'
alias  mono.@monorepo-private.poll-window-variable='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/poll-window-variable/; tabset --badge "@monorepo-private/poll-window-variable"'
alias  mono.@monorepo-private.react--background-img='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/react--background-img/; tabset --badge "@monorepo-private/react--background-img"'
alias  mono.@monorepo-private.react--fake-inset='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/react--fake-inset/; tabset --badge "@monorepo-private/react--fake-inset"'
alias  mono.@monorepo-private.style-once='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/style-once/; tabset --badge "@monorepo-private/style-once"'
alias  mono.@monorepo-private.wc--social='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/1-libs--simple/wc--social/; tabset --badge "@monorepo-private/wc--social"'

### 4-engine--browser/2-libs--cross-cutting/
alias  mono.@monorepo-private.practical-logger--browser='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/2-libs--cross-cutting/practical-logger--browser/; tabset --badge "@monorepo-private/practical-logger--browser"'
alias  mono.@monorepo-private.react--error-boundary='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/2-libs--cross-cutting/react--error-boundary/; tabset --badge "@monorepo-private/react--error-boundary"'
alias  mono.@monorepo-private.rich-text-format--to-react='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/2-libs--cross-cutting/rich-text-format--to-react/; tabset --badge "@monorepo-private/rich-text-format--to-react"'
alias  mono.@monorepo-private.soft-execution-context--browser='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/2-libs--cross-cutting/soft-execution-context--browser/; tabset --badge "@monorepo-private/soft-execution-context--browser"'
alias  mono.@monorepo-private.universal-debug-api--browser='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/2-libs--cross-cutting/universal-debug-api--browser/; tabset --badge "@monorepo-private/universal-debug-api--browser"'

### 4-engine--browser/X-incubator/active/
alias  mono.@monorepo-private.assets--background='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/assets--background/; tabset --badge "@monorepo-private/assets--background"'
alias  mono.@monorepo-private.assets--heroes='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/assets--heroes/; tabset --badge "@monorepo-private/assets--heroes"'
alias  mono.@monorepo-private.axo='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/axo/; tabset --badge "@monorepo-private/axo"'
alias  mono.@monorepo-private.font--comics='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/font--comics/; tabset --badge "@monorepo-private/font--comics"'
alias  mono.@monorepo-private.font--pixel='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/font--pixel/; tabset --badge "@monorepo-private/font--pixel"'
alias  mono.@monorepo-private.font--smallest='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/font--smallest/; tabset --badge "@monorepo-private/font--smallest"'
alias  mono.@monorepo-private.ohateoas-browser--react='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/ohateoas-browser--react/; tabset --badge "@monorepo-private/ohateoas-browser--react"'
alias  mono.@monorepo-private.react--hyperspace='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/react--hyperspace/; tabset --badge "@monorepo-private/react--hyperspace"'
alias  mono.@monorepo-private.react--starry-sky='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/react--starry-sky/; tabset --badge "@monorepo-private/react--starry-sky"'
alias  mono.@monorepo-private.react--window='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/react--window/; tabset --badge "@monorepo-private/react--window"'
alias  mono.@monorepo-private.rich-text-format--devtools='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 4-engine--browser/X-incubator/active/rich-text-format--devtools/; tabset --badge "@monorepo-private/rich-text-format--devtools"'

### 7-multimorphic/@oh-my-rpg/
alias  mono.@oh-my-rpg.state--codes='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 7-multimorphic/@oh-my-rpg/state--codes/; tabset --badge "@oh-my-rpg/state--codes"'
alias  mono.@oh-my-rpg.state--engagement='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 7-multimorphic/@oh-my-rpg/state--engagement/; tabset --badge "@oh-my-rpg/state--engagement"'
alias  mono.@oh-my-rpg.state--meta='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 7-multimorphic/@oh-my-rpg/state--meta/; tabset --badge "@oh-my-rpg/state--meta"'
alias  mono.@oh-my-rpg.state--prng='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd 7-multimorphic/@oh-my-rpg/state--prng/; tabset --badge "@oh-my-rpg/state--prng"'

### S-skus/@fantasy-workout/
alias  mono.@fantasy-workout.ontology='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/20-ontology/; tabset --badge "@fantasy-workout/ontology"'
alias  mono.@fantasy-workout.marketing='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/30-marketing/; tabset --badge "@fantasy-workout/marketing"'
alias  mono.@fantasy-workout.data='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/40-data/; tabset --badge "@fantasy-workout/data"'
alias  mono.@fantasy-workout.state='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/50-state/; tabset --badge "@fantasy-workout/state"'
alias  mono.@fantasy-workout.state--interfaces='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/51-state--interfaces/; tabset --badge "@fantasy-workout/state--interfaces"'
alias  mono.@fantasy-workout.web-core='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/70-web-core/; tabset --badge "@fantasy-workout/web-core"'
alias  mono.@fantasy-workout.web-property='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/80-web-property/; tabset --badge "@fantasy-workout/web-property"'
alias  mono.@fantasy-workout.final--web-app='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@fantasy-workout/90-final--web-app/; tabset --badge "@fantasy-workout/final--web-app"'

### S-skus/@infinite-monorepo/
alias  mono.@infinite-monorepo.known-versions='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/01-known-versions/; tabset --badge "@infinite-monorepo/known-versions"'
alias  mono.@infinite-monorepo.decisions='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/02-decisions/; tabset --badge "@infinite-monorepo/decisions"'
alias  mono.@infinite-monorepo.pkg-infos-resolver='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/03-pkg-infos-resolver/; tabset --badge "@infinite-monorepo/pkg-infos-resolver"'
alias  mono.@infinite-monorepo.structured-file-manifest='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/12-structured-file-manifest/; tabset --badge "@infinite-monorepo/structured-file-manifest"'
alias  mono.@infinite-monorepo.primitives='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/13-primitives/; tabset --badge "@infinite-monorepo/primitives"'
alias  mono.@infinite-monorepo.package-details='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/14-package-details/; tabset --badge "@infinite-monorepo/package-details"'
alias  mono.@infinite-monorepo.spec='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/15-spec/; tabset --badge "@infinite-monorepo/spec"'
alias  mono.@infinite-monorepo.graph='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/19-graph/; tabset --badge "@infinite-monorepo/graph"'
alias  mono.@infinite-monorepo.spec--defaults='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/42-spec--defaults/; tabset --badge "@infinite-monorepo/spec--defaults"'
alias  mono.@infinite-monorepo.spec--load='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/43-spec--load/; tabset --badge "@infinite-monorepo/spec--load"'
alias  mono.@infinite-monorepo.state='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/50-state/; tabset --badge "@infinite-monorepo/state"'
alias  mono.@infinite-monorepo.plugin='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/51-plugin/; tabset --badge "@infinite-monorepo/plugin"'
alias  mono.@infinite-monorepo.types-for-plugins='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/52-types-for-plugins/; tabset --badge "@infinite-monorepo/types-for-plugins"'
alias  mono.@infinite-monorepo.heuristics='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/60-heuristics/; tabset --badge "@infinite-monorepo/heuristics"'
alias  mono.@infinite-monorepo.pkg-analyzer='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/60-pkg-analyzer/; tabset --badge "@infinite-monorepo/pkg-analyzer"'
alias  mono.@infinite-monorepo.operation--apply='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/70-operation--apply/; tabset --badge "@infinite-monorepo/operation--apply"'
alias  mono.@infinite-monorepo.operation--resurrect='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/71-operation--resurrect/; tabset --badge "@infinite-monorepo/operation--resurrect"'
alias  mono.@infinite-monorepo.plugin--ai--agents--coding='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--ai--agents--coding/; tabset --badge "@infinite-monorepo/plugin--ai--agents--coding"'
alias  mono.@infinite-monorepo.plugin--changelog='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--changelog/; tabset --badge "@infinite-monorepo/plugin--changelog"'
alias  mono.@infinite-monorepo.plugin--editorconfig='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--editorconfig/; tabset --badge "@infinite-monorepo/plugin--editorconfig"'
alias  mono.@infinite-monorepo.plugin--git='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--git/; tabset --badge "@infinite-monorepo/plugin--git"'
alias  mono.@infinite-monorepo.plugin--graph='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--graph/; tabset --badge "@infinite-monorepo/plugin--graph"'
alias  mono.@infinite-monorepo.plugin--jetbrains='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--jetbrains/; tabset --badge "@infinite-monorepo/plugin--jetbrains"'
alias  mono.@infinite-monorepo.plugin--license='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--license/; tabset --badge "@infinite-monorepo/plugin--license"'
alias  mono.@infinite-monorepo.plugin--mise='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--mise/; tabset --badge "@infinite-monorepo/plugin--mise"'
alias  mono.@infinite-monorepo.plugin--nvm='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--nvm/; tabset --badge "@infinite-monorepo/plugin--nvm"'
alias  mono.@infinite-monorepo.plugin--offirmo='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--offirmo/; tabset --badge "@infinite-monorepo/plugin--offirmo"'
alias  mono.@infinite-monorepo.plugin--oxc--oxfmt='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--oxc--oxfmt/; tabset --badge "@infinite-monorepo/plugin--oxc--oxfmt"'
alias  mono.@infinite-monorepo.plugin--oxc--oxlint='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--oxc--oxlint/; tabset --badge "@infinite-monorepo/plugin--oxc--oxlint"'
alias  mono.@infinite-monorepo.plugin--parcel='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--parcel/; tabset --badge "@infinite-monorepo/plugin--parcel"'
alias  mono.@infinite-monorepo.plugin--pm--npm='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--pm--npm/; tabset --badge "@infinite-monorepo/plugin--pm--npm"'
alias  mono.@infinite-monorepo.plugin--pm--package-json='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--pm--package-json/; tabset --badge "@infinite-monorepo/plugin--pm--package-json"'
alias  mono.@infinite-monorepo.plugin--pm--pnpm='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--pm--pnpm/; tabset --badge "@infinite-monorepo/plugin--pm--pnpm"'
alias  mono.@infinite-monorepo.plugin--pm--yarn--v1='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--pm--yarn--v1/; tabset --badge "@infinite-monorepo/plugin--pm--yarn--v1"'
alias  mono.@infinite-monorepo.plugin--readme='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--readme/; tabset --badge "@infinite-monorepo/plugin--readme"'
alias  mono.@infinite-monorepo.plugin--tosort='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--tosort/; tabset --badge "@infinite-monorepo/plugin--tosort"'
alias  mono.@infinite-monorepo.plugin--turborepo='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--turborepo/; tabset --badge "@infinite-monorepo/plugin--turborepo"'
alias  mono.@infinite-monorepo.plugin--typescript='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--typescript/; tabset --badge "@infinite-monorepo/plugin--typescript"'
alias  mono.@infinite-monorepo.plugin--unit-tests='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--unit-tests/; tabset --badge "@infinite-monorepo/plugin--unit-tests"'
alias  mono.@infinite-monorepo.plugin--vite='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--vite/; tabset --badge "@infinite-monorepo/plugin--vite"'
alias  mono.@infinite-monorepo.plugin--vscode='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/plugin--vscode/; tabset --badge "@infinite-monorepo/plugin--vscode"'
alias  mono.@infinite-monorepo.X-test-package='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@infinite-monorepo/X-test-package/; tabset --badge "@infinite-monorepo/X-test-package"'

### S-skus/@rpg--modern/
alias  mono.@rpg--modern.marketing='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@rpg--modern/30-marketing/; tabset --badge "@rpg--modern/marketing"'
alias  mono.@rpg--modern.final--web-app='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@rpg--modern/90-final--web-app/; tabset --badge "@rpg--modern/final--web-app"'

### S-skus/@rpg--space/
alias  mono.@rpg--space.marketing='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@rpg--space/30-marketing/; tabset --badge "@rpg--space/marketing"'
alias  mono.@rpg--space.web-components='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@rpg--space/80-web-components/; tabset --badge "@rpg--space/web-components"'
alias  mono.@rpg--space.web-core='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@rpg--space/81-web-core/; tabset --badge "@rpg--space/web-core"'
alias  mono.@rpg--space.final--web-app='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@rpg--space/90-final--web-app/; tabset --badge "@rpg--space/final--web-app"'

### S-skus/@social-skills/
alias  mono.@social-skills.cli--social='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@social-skills/cli--social/; tabset --badge "@social-skills/cli--social"'

### S-skus/@storypad/
alias  mono.@storypad.storypad='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@storypad/storypad/; tabset --badge "@storypad/storypad"'

### S-skus/@tbrpg/
alias  mono.@tbrpg.marketing='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/30-marketing/; tabset --badge "@tbrpg/marketing"'
alias  mono.@tbrpg.web-property='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/80-web-property/; tabset --badge "@tbrpg/web-property"'
alias  mono.@tbrpg.final--web-app='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/90-final--web-app/; tabset --badge "@tbrpg/final--web-app"'
alias  mono.@tbrpg.definitions='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l10-definitions/; tabset --badge "@tbrpg/definitions"'
alias  mono.@tbrpg.logic--weapons='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l20-logic--weapons/; tabset --badge "@tbrpg/logic--weapons"'
alias  mono.@tbrpg.logic--armors='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l21-logic--armors/; tabset --badge "@tbrpg/logic--armors"'
alias  mono.@tbrpg.logic--monsters='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l22-logic--monsters/; tabset --badge "@tbrpg/logic--monsters"'
alias  mono.@tbrpg.logic--adventures='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l24-logic--adventures/; tabset --badge "@tbrpg/logic--adventures"'
alias  mono.@tbrpg.logic--adventure--resolved='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l25-logic--adventure--resolved/; tabset --badge "@tbrpg/logic--adventure--resolved"'
alias  mono.@tbrpg.logic--shop='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l26-logic--shop/; tabset --badge "@tbrpg/logic--shop"'
alias  mono.@tbrpg.state--energy='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l30-state--energy/; tabset --badge "@tbrpg/state--energy"'
alias  mono.@tbrpg.state--achievements='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l31-state--achievements/; tabset --badge "@tbrpg/state--achievements"'
alias  mono.@tbrpg.state--wallet='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l32-state--wallet/; tabset --badge "@tbrpg/state--wallet"'
alias  mono.@tbrpg.state--inventory='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l33-state--inventory/; tabset --badge "@tbrpg/state--inventory"'
alias  mono.@tbrpg.state--character='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l34-state--character/; tabset --badge "@tbrpg/state--character"'
alias  mono.@tbrpg.state='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l39-state/; tabset --badge "@tbrpg/state"'
alias  mono.@tbrpg.interfaces='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l40-interfaces/; tabset --badge "@tbrpg/interfaces"'
alias  mono.@tbrpg.ui--rich-text='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l50-ui--rich-text/; tabset --badge "@tbrpg/ui--rich-text"'
alias  mono.@tbrpg.l60-ohateoas='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l60-ohateoas/; tabset --badge "@tbrpg/l60-ohateoas"'
alias  mono.@tbrpg.l81-web--core='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tbrpg/l81-web--core/; tabset --badge "@tbrpg/l81-web--core"'

### S-skus/@tracer-bullet--web-app/
alias  mono.@tracer-bullet--web-app.marketing='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tracer-bullet--web-app/50-marketing/; tabset --badge "@tracer-bullet--web-app/marketing"'
alias  mono.@tracer-bullet--web-app.isomorphic-state='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tracer-bullet--web-app/60-isomorphic-state/; tabset --badge "@tracer-bullet--web-app/isomorphic-state"'
alias  mono.@tracer-bullet--web-app.web-core='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tracer-bullet--web-app/70-web-core/; tabset --badge "@tracer-bullet--web-app/web-core"'
alias  mono.@tracer-bullet--web-app.web-property='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tracer-bullet--web-app/80-web-property/; tabset --badge "@tracer-bullet--web-app/web-property"'
alias  mono.@tracer-bullet--web-app.final--web-app='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@tracer-bullet--web-app/90-final--web-app/; tabset --badge "@tracer-bullet--web-app/final--web-app"'

### S-skus/@web-property-outfitter/
alias  mono.@web-property-outfitter.spec='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@web-property-outfitter/10-spec/; tabset --badge "@web-property-outfitter/spec"'
alias  mono.@web-property-outfitter.output='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@web-property-outfitter/50-output/; tabset --badge "@web-property-outfitter/output"'
alias  mono.@web-property-outfitter.generator--html--snippets='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@web-property-outfitter/generator--html--snippets/; tabset --badge "@web-property-outfitter/generator--html--snippets"'
alias  mono.@web-property-outfitter.generator--html='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@web-property-outfitter/generator--html/; tabset --badge "@web-property-outfitter/generator--html"'
alias  mono.@web-property-outfitter.generator--svg='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@web-property-outfitter/generator--svg/; tabset --badge "@web-property-outfitter/generator--svg"'
alias  mono.@web-property-outfitter.generator--website-entry-points='cd "$MONOREPO_ROOT__CURRENT"; mise install; git--offirmo.sh; cd S-skus/@web-property-outfitter/generator--website-entry-points/; tabset --badge "@web-property-outfitter/generator--website-entry-points"'
