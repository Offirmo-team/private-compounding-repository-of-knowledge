# New improved Hypermedia

## Introduction

Goal:

- new Hypermedia format to be used as "representation" for **true** REST / HATEOAS architecture
  - HATEOAS = Hypermedia as the Engine of Application State https://htmx.org/essays/hateoas/
  - would need a new kind of browser, of course
- higher level
- AI compatible = text/markdown compatible + "context"-compatible (summary)
- chat-like interface compatible
  - by extension terminal compatible
  - great for accessibility!
- ideally striving back to a thinner client
  - yet supporting progressive enhancement / fat client

## concepts

1. Hypertext = text displayed on a computer display or other electronic devices with references (hyperlinks) to other
   text that the reader can immediately access https://en.wikipedia.org/wiki/Hypertext
   - Apart from text, the term "hypertext" is also sometimes used to describe tables, images, and other presentational
     content formats with integrated hyperlinks
   - hypertext enables the easy-to-use publication of information over the Internet
2. Hyperlink = digital reference providing direct access to data by a user's clicking or tapping
   https://en.wikipedia.org/wiki/Hyperlink
3. Hypertext Markup Language (HTML) https://en.wikipedia.org/wiki/HTML
   - needs a client = the web browser
   - "Fatal Flaw of HTML" = The harsh reality is that HTML never got to the point that it could, by itself, offer UX
     approaching the thick client. Pure server-side rendered HTML offered only a simple & clunky Click → Request → Page
     Render model
4. Hypermedia = an extension of hypertext, is a nonlinear medium of information that includes graphics, audio, video,
   plain text and hyperlinks
   - Hypermedia-Driven Application Architecture https://htmx.org/essays/hypermedia-driven-applications/
   - needs a client = the web browser
   - Hypermedia as the Engine of Application State (HATEOAS) = a client interacts with a network application whose
     application servers provide information dynamically through hypermedia. A REST client needs little to no prior
     knowledge about how to interact with an application or server beyond a generic understanding of hypermedia
     https://htmx.org/essays/hateoas/
5. Hyperview = further extension where the UI itself "supports common UI elements like headers, scroll views, lists,
   text field, and much more" is encoded https://hyperview.org/docs/guide_introduction
6. Representational State = representation of a resource containing hypermedia links that can be followed to make the
   state of the system change. Any such request will in turn receive the representation of a resource, and so on
   https://en.wikipedia.org/wiki/REST https://ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm 6.2.1
   - the only identifier that needs to be known is the identifier of the first resource requested, and all other
     identifiers will be discovered
7. Representational State Transfer (REST) = set of constraints for how the architecture of a distributed, Internet-scale
   hypermedia system, such as the Web, should behave https://en.wikipedia.org/wiki/REST
   - stateless, cacheable, uniform interface
   - mismatches, ex. HTTP cookies violate REST constraints because they can become out of sync with the browser's
     application state https://ics.uci.edu/~fielding/pubs/dissertation/evaluation.htm
   - Richardson Maturity Model 0,1,2,3 https://martinfowler.com/articles/richardsonMaturityModel.html

Spectrums:

- hypertext -> hypermedia -> hyperview
- MPA -> HDA <- SPA https://htmx.org/essays/hypermedia-driven-applications/#genesis

thin/thick client + thick/thin servers but also now edge!

### existing

- HTML
  - is "screen only", a screen replaces the previous screen on navigation
  - can use frames, but frames have perf issues
  - led to the emergence of SPAs "sad state of web development" https://htmx.org/essays/a-response-to-rich-harris/
- HTML+htmx slightly improves on that
- HXML https://hyperview.org/docs/guide_html

## Spec

We want more.

See all the essays in https://htmx.org/essays/

Warning: avoid inner platform effect!!!

- new Hypermedia format to be used as "representation" for **true** REST / HATEOAS architecture
  - would need a new kind of browser, of course
  - HATEOAS: avoid state as much as possible at all level, try to help the layer above to avoid state
- should be generic to be used in both terminal, chat-like interface, web app, mobile app…
- JSON based (obviously)
- would always have a text representation
  - with optional enrichments as supported by the "browser", but would have a fallback representation
    - illustrations
    - bg picture
      - landscape
    - soundscape
    - ...
- auto-reloads should not end in failures = broken pages
- keep the semantic!
- mutations not limited to PUT/POST/DELETE, also RPC/action
  - not restricted to <a> & <form>
- optionally code-on-demand? (lazy loading?)
- would not need a full screen refresh (the case for SPA)
  - tabs? trees? tables?
  - frames/widgets?
  - tooltips? ("floating UI" https://floating-ui.com/)
- support other "streams" of representation: (TBD!)
  - flow, // normal immediate feedback to user actions
  - vs. floating = not disrupting the flow
  - popup // full screen ? sub-container?
  - flyout
  - popover
  - announcement
  - cutscene
  - skippable
  - possibility of aborting? (difficult) semantic_level?: 'error' | 'warning' | 'info' | 'success',
  - auto-dismiss?
  - ...
- push from server (the other missing case from PWA/traditional html)
- rsrc + pending engagements
- offline first
- progressive enhancement
- improved concept of "session"
  - not tied to tab life
    - bc for ex. if tab left for a long time, may be considered a new session
    - also bc we want to embrace "multi tab" work = no need to have several recaps or notifs
  - also concept of recap
- ideally should embed the concept of notifications as well
- support preview = highly simplified summary of a rsrc
- should be designed to be composable, with different teams working on different rsrc
  - ex. no "overall hints" at the root, should be discoverable along the way
- And don't forget!
  - cool!
  - whimsical!

recommended design? chain of resources with "continueᝍto" or actions/engagements? ex. TBRPG's play = action/engagement?
or /aventure -> /adventure/last -> adventures? -> rsrc when we may want to go back to it (ex last adventure's result) ->
engagement when disposable + we don't want to have it again if revisiting the rsrc

+application posture = sovereign, transient, background, auxiliary https://en.wikipedia.org/wiki/Application_posture

terminal https://jvns.ca/blog/2024/10/01/terminal-colours/
https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences

alerts processing
https://support.rabby.io/hc/en-us/articles/11495471837071-What-does-Please-process-the-alert-before-signing-mean
