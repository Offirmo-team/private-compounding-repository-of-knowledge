# AGENTS.md

## Project overview

See [README.md](README.md)

## Build and test commands

DO NOT manage dependencies yourself, there is a tool for that. Ask the user to run it.

DO NOT call `brew`. The local installation is a bit specific. Ask the user to do it when you need to run `brew`.

## Code style guidelines

See [07-conventions--formatting.md](%23%23CONTRIBUTING/07-conventions--formatting.md)

## Testing instructions

IMPORTANT we want to migrate to `vitest`. When writing new unit tests, DO NOT follow the legacy mocha + chai, use
state-of-the-art vitest.

## Security considerations
