#!/usr/bin/env bash
#MISE description="cleans any low-value generated / built / temporary files"

set -euo pipefail

echo "Executing task ${MISE_TASK_NAME:-$(basename "${BASH_SOURCE[0]}" .bash)}..."


## First, efficiently clean all known stuff not needed by turbo/pnpm by folder name
## out/ = output of turbo prune (rarely used)
echo "↳ cleaning..."
rm -rf out/


## common prepare/build ones:
echo "↳ cleaning..."
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


## then calls the individual packages dedicated clean scripts via turbo
## (if any)
echo "↳ cleaning..."
(pnpx turbo run clean --output-logs=errors-only) > /dev/null 2>&1 || true


## now that we called pnpm/turbo,
## we can clean stuff needed by pnpm/turbo
echo "↳ cleaning..."
find . -type d \( \
           -name node_modules \
        -o -name .turbo \
    \) \
    -prune \
    -exec rm -rf {} +


## final stuff
echo "↳ cleaning..."
find . -type f \( \
           -name "*.log" \
        -o -name .DS_Store \
    \) \
    -prune \
    -exec rm -f {} +




echo "↳ Done."

echo ""
echo "More suggestions for cleaning one's local env (not run automatically, copy/paste at will):"
echo '  rm -rf "$(pnpm store path)"'
echo '  mise prune'
echo '  mise cache clear'
echo '  nvm cache clear'
echo '  brew cleanup --prune=14'
echo '  sudo port reclaim'
