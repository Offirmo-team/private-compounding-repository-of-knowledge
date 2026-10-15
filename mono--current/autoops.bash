#! /bin/bash

set -euo pipefail;

#################################################

AUTOOPS_LOG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/autoops.log"

mise install
{ pnpm i || true; } 2>/dev/null

#################################################

pushd ./S-skus/@infinite-monorepo/70-operation--apply > /dev/null
## critical to be able to reach npm registry in some cases
export NODE_USE_ENV_PROXY=1
node module/~~sandbox/index.ts 2>&1 | tee "$AUTOOPS_LOG"
popd > /dev/null

#################################################

{ pnpm i || true; } 2>/dev/null
{ pnpx oxfmt@catalog: || true; }
pnpm i

{ pnpm outdated || true; } 2>/dev/null
