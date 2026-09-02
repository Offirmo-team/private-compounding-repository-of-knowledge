## indentation

See [.editorconfig](../.editorconfig)

Tabs width = whatever you want, it's display only!

## EOL

unix (should be enforced by git)

## prettifying

We use oxfmt. Run `pnpx oxfmt` at the root.

## file structure

### JavaScript / TypeScript

- imports
  - by order of 1) system 2) external libs 3) internal libs 4) current libs
  - (TODO one day) cannot depend on lexicographically higher (prevent loops)

```tsx
/* PROMPT
 * ’…
 */

/////////////////////////////////////////////////

export function create(): Immutable<State> {}
function getꓽXYZⵧfoo‿v2(): void {}
function deriveꓽXYZⵧfoo‿v2(): void {}
/*
const ǃ = assert_from({my_func})
assertꓽnode_is_xyz()
isꓽStory‿v2(x: Immutable<any>): s is Story‿v2 {

ↆasyncⵧfetch
ೱasyncⵧpromise

ϟevent
ǃerror
aꓺbꘌc
notᝍbadₓasⳇwell‿no
fooǃfooꓽfoo
fooꜛbarꜜfoo
ꓽpackageᝍlockᐧjson
matching? (formerly 𝝣 which causes issues)
TODO express a resilient function who technically should never crash?
ᄆComponent
 */

/** @deprecated Use xyz... */
// @ts-expect-error
// @ts-ignore

// oxlint-disable-next-line no-console
/* oxlint-disable no-console */
// prettier-ignore
const a=42

/* prettier-ignore */
const x=()=>{return      2;}

;<>
  {/* prettier-ignore */}
  <span     ugly  format=''   />
</>

/////////////////////////////////////////////////

import { assert_from } from "@monorepo-private/assert"
import type { Immutable } from "@monorepo-private/ts--types"

import type {} from "./types.ts"
```

```ts
/////////////////////////////////////////////////

function expectㆍfileㆍstatesㆍdeepㆍequal(s1: Immutable<State>, s2: Immutable<State>, should_log = true): void {
  assert(...)
}

describe(`${LIB} -- examples`, function() {

	describe('DEMO_STATE', function () {

		it('should be stable and up to date', () => {
			const migrated = migrate_toꓽlatest(getꓽSXC(), DEMO_STATE)
			expect(migrated).to.equal(DEMO_STATE)
		})
	})
})

/////////////////////////////////////////////////

import { expect } from 'chai'
import { describe, it } from 'mocha'

import { LIB } from './consts.ts'
import { getꓽSXC } from './sec.ts'

import {
...
} from './index.ts'
```

More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

```tsx
/////////////////////////////////////////////////

import Component from "./index.tsx"

export default {
  parameters: {
    // layout: "centered" "fullscreen" "padded" "bare",
  },
  component: Component,
  //render: ({target}: Props) => `Hi ${target}👋 (look at the dev console)`,
  args: {
    target: "special",
  },
  decorators: [
    (Story: unknown, context: StoryContext) => {
      console.log("Hello from Decorator Meta/1", { Story, context })
      return Story as any
    },
  ],
} satisfies Meta‿v3

/////////////////////////////////////////////////

export const Default: Story‿v3 = {}

export function Div() {
  return `
<div>hello</div>
`
}

/////////////////////////////////////////////////

import type { Meta‿v3, Story‿v3, StoryContext } from "@monorepo-private/storypad"
```

## Core unicode

Arrows and supplemental https://jrgraphix.net/r/Unicode/2190-21FF https://jrgraphix.net/r/Unicode/2900-297F
https://jrgraphix.net/r/Unicode/2B00-2BFF

```
⇱   ↰ ↱       ↕ ↔
  ↖  ↑  ↗     ↢ ↣
  ←  ↻  → ↴   ⇐ ⇒
  ↙  ↓  ↘     ↻ ↩ ↪ ↺ ⟲ ⟳
  ↵ ↲ ↳   ⇲   ⇄ ⇅ ⇆ ⮂ ⮃
   ⮐ ⮑      ↯
  ˹  ˄  ˺
‹ « ˂ ˃ » ›
  ˻  ˅  ˼
```

Logs https://jrgraphix.net/r/Unicode/2600-26FF https://jrgraphix.net/r/Unicode/2700-27BF

```
☐ ☑ ☒ ⚿ ⛫ ⛉ ⛊
⚐ ⚑ ⚠ ⚡ ⚠️ ❓❔❕❗
⛀ ⛁ ⛂ ⛃
✓ ✕ ✗  ✔ ✘ ✖  ✅ ❎ ❌ ⛔
⌥ ⌦ ⌘
⚙

console.log(`🔄 <Component />`, { prop });
```

box drawing https://jrgraphix.net/r/Unicode/2500-257F

```
╔ ═ ━ ┉ ┅ ╍ ─ ┈ ┄ ╌ ╶┼╴
║                   ╺╋╸
┃ ╒═╤═╕ ╓─╥─╖ ╔═╦═╗    ╿
┋ ╞═╪═╡ ╟─╫─╢ ╠═╬═╣   ╾┼╼
┇ ╘═╧═╛ ╙─╨─╜ ╚═╩═╝    ╽
╏ ┌─┬─┐ ┍━┯━┑ ┎─┰─┒ ┏━┳━┓ ╭─╮
│ ├─┼─┤ ┝━┿━┥ ┠─╂─┨ ┣━╋━┫ │ │
┊ └─┴─┘ ┕━┷━┙ ┖─┸─┚ ┗━┻━┛ ╰─╯
┆ ┞┦ ┡┩ ┟┧ ┢┪
╎ ┭ ┮  ┱ ┲
╷ ┵ ┶  ┹ ┺
╵ ┽ ┾ ╀ ╁ ╃ ╄ ╅ ╆ ╇ ╈ ╉ ╊
╻
╹
```
