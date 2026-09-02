## Principles

Unless it's more convenient for some reason, this repo strives to adhere to those principles:

- readability is the top desirable code property
  - ["Code for the human, not the computer"](https://read.engineerscodex.com/p/7-simple-habits-of-the-top-1-of-engineers)
  - TypeScript https://www.typescriptlang.org/
- fight complexity or at least encapsulate it (lol I'm not really following this)
- single source of truth
  - flux architecture
- problems broken down in manageable components = separation of concerns
- immutability if possible
- functional programming
- command / query separation
- compatible with event sourcing (for offline first with server replay when back online)
- mobile first
- offline first
- open source
  - give back with licenses such as UNLICENSE or CC
  - open source whenever possible
- use boring technologies. Examples:
  - (if possible) node LTS over latest
  - (if possible) npm over yarn
  - as few tools as possible
  - Postgres
- dev should be possible locally
  - avoid using cloud-only services
- ideally should even work by opening a local .html file
- avoid vendor lock-in
  - ex. auth, aws...
  - wrap commonly used modules into a thin, semantic layer
- ...

Good reads

- 2023 https://read.engineerscodex.com/p/7-simple-habits-of-the-top-1-of-engineers
