# Installation

## 2026

I use [macOS 26.6](update marker) but this should work on any unix-like system. Windows not tested, unlikely to work.

This set of command will build everything: (required as there are dependencies between modules)

```bash
## First: update OS, brew, nvm, etc.
## Then:
mise install
pnpm install
```

## Common issues

### gyp errors

1. Do we need the module? Better to use pure JS ones.
2. updates
3. possible: `sudo rm -r -f /Library/Developer/CommandLineTools; xcode-select --install;`
