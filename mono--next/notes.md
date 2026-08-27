



## Keep what worked well
- ✅ bolt = simple and effective monorepo solution
- ✅ small modules with ability to incrementally "resurrect/repair" them one by one when making major changes (ex. ESM, node 23 type stripping)


## remediate a few things
- ✅ manually tracking dependencies (dev, peer etc) = chore to add them by hand + never cleared if no longer used
  - ✅ also install @types automatically (by inspecting if types are provided)
- starting to have too many bolt workspaces 1- 2- 3-
- uneasy to move packages around and split into smaller ones
- maybe support "vendored" pkgs automatically?
- ✅ painful upgrade of tsconfig, pkg.json, etc. => they should be auto-generated
  - ex. switching to noEmit / node 23 type stripping
    - requires changes to test command
    - require adding a new "fake build" for tests
- enable out-of-source build
  - difficult due to node looking for modules up the file tree in-place!
  - turbo prune?
- no longer need to "move" packages, they would be in a flat, single source of truth place
  - sorting by languages?
- easy to split packages
- usually working only on one project, but slowed down by the other un-needed modules
  - unneeded deps take too long to install
- manual yarn outdated
- AI-intelligible? (how?)
  - ability to "scope" the current project with only the needed code

## module life cycle / tiers / ratings

Concepts:
- beware of conflating concepts, maybe we need multiple ratings ex. capability vs tier vs architecture
- idea of try/test/graduate
- dictates quality, ex. unit tests, coverage...
- a module can only be consumed from lower-or-equally rated modules
- v1 vs v2 (not in the semver sense) = important concept 
  - v1 (not in the semver sense) aka first release = often considered "low quality" as it's when spec discovery happened
  - v2 (not in the semver sense) aka rewrite = on the other hand, considered much higher quality as all the discovered specs have been integrated into a holistic architecture = usually faster, clearer...
  - could be captured as "last architecture cleanup" = null | YYYY"

spike -> demo -> stable -> core -> critical ?

1. spike
1. technical demo ???
1. sandbox = not public, to test other modules ~"dev integration" 
1. incubator / experimental ???
1. stable


product - Products can be thought as a composition of various capabilities empowering users to perform various tasks.
service - a deployable software component fulfilling specific function within a product. Can be used by other services in same or different products = containers of capabilities
capability - As “A Capability is functionality that a product or platform provides to a customer. In short, a Capability’s scope covers what our customers care about“

C1, C2, C3 importance reflecting global capability rank C1 being critical, C2 important and C3 regular


Tier 0 is the foundation level
Tier 0 = C1 for more than one product 
service which supports more than one C1 capability from different product
Tier 1 = C1 Critical business service which supports at least one C1  capability but all of C1 capabilities are within the same product
Tier 2 C2 Maximum level of capability supported is C2
Tier 3 C3 Maximum level of capability supported is C3

## tosort
Ideas
- AI-intelligible
- /module (~src) is the source of truth
- highly re-organizable = packages can be moved around, renamed, etc. without breaking anything
- deps auto-generated, triaged by tree depth
- out-of-source build, ex. tsconfig out of src
- cycle detection
- "scopes"

detection of node / web
detection of APIs (global vars)

structured vs unstructured

AI
+++ tech specs https://hybridhacker.email/p/how-to-write-great-tech-specs
prompt


https://bazel.build/concepts/build-ref
boundary marker
= BUILD file for Bazel

visibility (bazel) = whether a target allow being depended upon by X

pkg groups

hinting
= file expected to be modified by hand / not

auto extracting layers by depth

exposing only "top level" usages
= unused code is automatically excluded from the build = no need to keep updated


Hard dependencies/Soft dependencies
