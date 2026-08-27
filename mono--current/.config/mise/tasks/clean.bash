#!/usr/bin/env bash
#MISE description="cleans any low-value generated / built / temporary files"
set -euo pipefail

# First, efficiently clean all known stuff not needed by turbo/pnpm by folder name
# out/ = output of turbo prune (rarely used)
rm -rf out/

# common prepare/build ones:
find . -type d \( \
           -name dist \
        -o -name .generated-types \
        -o -name .next \
        -o -name .prisma-client \
        -o -name .react-router \
        -o -name .turbo \
        -o -name .vercel \
    \) \
    -prune \
    -exec rm -rf {} +

# then calls the individual packages dedicated clean scripts via turbo
(pnpx turbo run clean --output-logs=errors-only) > /dev/null 2>&1 || true

# finally clean stuff needed by pnpm/turbo
find . -type d \( \
           -name node_modules \
        -o -name .turbo \
    \) \
    -prune \
    -exec rm -rf {} +

# More suggestions for cleaning one's local env:
# rm -rf "$(pnpm store path)"
# nvm cache clear
# sudo port reclaim
