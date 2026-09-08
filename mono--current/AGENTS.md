# AGENTS.md

## Project overview

See [README.md](README.md)

## Build and test commands

DO NOT manage dependencies yourself in package.json or pnpm: there is a tool that auto-generates those files. Just use
the packages you need and ask the user to run the tool to update package.json etc.

DO NOT remove import of assert libs, even if unused. We preemptively leave it to encourage using assertions. Btw fee
free to add some if relevant. Use the isomorphic "@monorepo-private/assert" if possible.

DO NOT call `brew`. The local installation is a bit specific. Ask the user to do it when you need to run `brew`.

## Code style guidelines

See [07-conventions--formatting.md](%23%23CONTRIBUTING/07-conventions--formatting.md)

## Testing instructions

IMPORTANT we want to migrate to `vitest`. When writing new unit tests, DO NOT follow the legacy mocha + chai, use
state-of-the-art vitest.

## Security considerations

This is hobby-level code, but we pride ourselves in solid architecture. Code securely without over-doing it.
