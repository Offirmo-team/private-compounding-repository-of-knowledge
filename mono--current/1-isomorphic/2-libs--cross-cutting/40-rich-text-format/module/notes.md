## Intro

A new rich text format designed for programmatic generation, transfer and rendering.

Goals:

- be isomorphic
  - = can be rendered everywhere
    - sheet of paper
    - pure text (fixed width or not), markdown...
    - Terminal (escape codes, images, ascii art...)
    - Web: Html, React... (interactive or not)
    - Twitter, Instagram
    - ...
- be semantic
  - = helps isomorphic-ness by leaving as many decisions as possible to the renderer, depending on the capabilities of
    the target medium
- being able to be serialized and transferred across protocols
  - JSON
- being usable as a Hypermedia representation for true REST
- having a natural structure making sense when inspected as raw JSON
- challenge JSON, Markdown, HTML in some aspects

This format is half-way between raw text and HTML, a bit similar to Markdown.

Differences with other document formats ()

- vs. Atlassian, Slack...
  - we don't systematically have an array of children Instead, when applicable, a text with references to other nodes is
    used. Advantages:
    - a bit more readable
    - we can re-use nodes
    - we can over-supply nodes and not always use them Arrays are still allowed to express semantic constructs like
      lists, tables, header>content<footer, but should be avoided if not necessary.
- vs. Html
  - we aim at true REST HATEOAS
- vs. Markdown

## Concepts

- inline vs block https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block
- sectioning
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories#sectioning_content
- header/heading https://egyetemi.anglofon.hu/blog/difference-between-heading-and-header/
  > Header is a general description of the document which is displayed at the top of every page. For example, most word
  > processor software contain a special feature for inserting text that would appear on every page. The same applies to
  > the footer, which is displayed at the bottom of every page, along with the page numbering.
  >
  > Heading is the word or phrase that or sentence that explains what the following part is about. It is written at the
  > beginning of a structural part, therefore, it is considered a structural element of a document. It clearly indicates
  > the content of the following section.
  >
  > In legal writing, heading is an important means of arranging the content. Contracts, for example, are divided into
  > various structural parts, such as articles, sections and clauses. However, contracts very often spell out that
  > headings and titles are not included in the interpretation of the contract, but they are used for explanatory
  > purposes, at often worded they are used for "convenience of reference".
- doc outline algorithm
  - https://adrianroselli.com/2016/08/there-is-no-document-outline-algorithm.html
  - https://adrianroselli.com/2013/12/the-truth-about-truth-about-multiple-h1.html
- Front Matter
  - https://docs.github.com/en/contributing/writing-for-github-docs/using-yaml-frontmatter
  - not needed in our case since we're not a text format and have extensible hints

## TODO

See also:

- generative / "just in time" UI https://json-render.dev/

TODO escaping (mitigated for now with a rare codepoint)

- not a bad idea, though.
- could use more: https://www.compart.com/en/unicode/block/U+2300

TODO license TODO credits

TODO i18n

- TODO should it be first class citizen or an extension? or before/after?
- TODO beware of still allowing message extraction tools
- TODO custom date and number formatting
- TODO ICU message format?

TODO a11y

- similar to HTML?

TODO @mentions ?

TODO #hashtags ?

TODO some AI stuff? TODO some web3 stuff?

⎨⎨place|filter1|filter2⎬⎬ content

## references / prior art

### html

https://allthetags.com/

### Markdown

https://www.anildash.com/2026/01/09/how-markdown-took-over-the-world/

https://www.markdownguide.org/cheat-sheet/

### ICU i18n syntax

- v2 draft https://github.com/unicode-org/message-format-wg/tree/main/spec
- v1 https://unicode-org.github.io/icu/userguide/format_parse/messages/

https://formatjs.github.io/docs/core-concepts/icu-syntax

### other doc formats

- "Atlassian Document Format" https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/

Related, discovered after I made mine:

- Slack's "block kit" https://api.slack.com/block-kit
  - https://api.slack.com/tools/block-kit-builder
- Twitter Text https://github.com/twitter/twitter-text
- +++ Siren: a hypermedia specification for representing entities https://github.com/kevinswiber/siren

## tosort

It has only 1 dimension (flow) but hints can be added to render in a more fancy way if supported. Ex. a "ul/ol" hint.

https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- https://formatjs.io/docs/core-concepts/icu-syntax/

TODO one day add a linting feature:

- lint types etc.

```js
import * as RichText from "@monorepo-private/rich-text-format"

const $doc = RichText.fragmentⵧblock()
  .pushNode(RichText.heading().pushText("Identity:").done(), { id: "header" })
  .pushNode(RichText.listⵧunordered().pushKeyValue("name", $doc_name).pushKeyValue("class", $doc_class).done())
  .done()

console.log(RichText.renderⵧto_text($doc))
console.log(RichText.renderⵧto_actions($doc))
```

```ts
import type { Immutable } from "@monorepo-private/ts--types"

import {
  type BaseRenderingOptions,
  DEFAULT_RENDERING_OPTIONSⵧWalk,
  type WalkerCallbacks,
  walk,
} from "@monorepo-private/rich-text-format"
```

pipe traits params

`⎨⎨foo|Capitalize⎬⎬`

// TODO "progressive" styles // TODO "progressive" colors // TODO "progressive" emojis / images etc.

TODO explore rendering monospace + web like this https://owickstrom.github.io/the-monospace-web/

TODO graphs https://github.com/lukilabs/beautiful-mermaid
