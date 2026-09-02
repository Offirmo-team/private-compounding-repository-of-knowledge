---
name: setup
description: Run initial monorepo setup. Triggers on "setup", "install", "bootstrap", or first-time setup requests.
---

# Monorepo Setup

Run setup steps automatically. Only pause when user action is required.

**Principle:** When something is broken or missing, fix it. Don't tell the user to go fix it themselves unless it
genuinely requires their manual action. If a dependency is missing, install it. Ask the user for permission when needed,
then do the work.

## 0. [Mise](https://mise.jdx.dev/getting-started.html)

Install Mise by following the "Installation" section in the link above.

Run `mise settings experimental=true`

Run `mise doctor` which should succeed. Fix any issue reported.

## 1. Bootstrap (runtime + global tools)

Install through mise `mise install`

Ensure mise-managed tools are latest with `mise upgrade`

Validate the setup:

1. read "engines" in `package.json`. For each of them, read their installed versions and check it matches
1. read "packageManager" in `package.json`. For each of them, read their installed versions and check it matches
1. read `mise.toml` and check it is coherent with the fields above

## 2. Install (dependencies and preparations)

```bash
pnpm install
```

## Troubleshooting

TODO: capture complex issues that the agent was not able to fix.
