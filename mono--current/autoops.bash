#! /bin/bash

set -euo pipefail;

AUTOOPS_LOG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/autoops.log"

mise install
{ pnpm i || true; } 2>/dev/null


#pushd ./0-meta/X-to-reorganize/monorepo > /dev/null
#PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm run sandbox
pushd ./S-skus/@infinite-monorepo/70-operation--apply > /dev/null
node module/~~sandbox/index.ts 2>&1 | tee "$AUTOOPS_LOG"
popd > /dev/null

{ npx oxfmt || true; }

{ pnpm i || true; } 2>/dev/null
pnpm i

#mise ERROR No version is set for shim: yarn
#Set a global default version with one of the following:
#mise use -g node@25.9.0
#mise use -g npm:corepack@0.34.7
#mise ERROR Run with --verbose or MISE_VERBOSE=1 for more information
