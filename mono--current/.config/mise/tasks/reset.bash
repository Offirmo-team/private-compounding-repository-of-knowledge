#!/usr/bin/env bash
#MISE description="do a 'clean' then cleans deeper, potentially removing local data (e.g. env vars) to fix a broken setup or starting fresh"
#MISE depends=["clean"]

set -euo pipefail

echo "Executing task ${MISE_TASK_NAME:-$(basename "${BASH_SOURCE[0]}" .bash)}..."


## env files
echo "↳ cleaning..."
find . -type f \( \
           -name .env \
        -o -name '.env.*' \
        -o name .dev.vars \
        -o -name .test.vars \
        \) \
    -exec rm -f {} +


## local feature flags
echo "↳ cleaning..."
rm -f config/ldcli/state/dev_server.db


echo ""
echo "More suggestions for reseting one's local env (not run automatically, copy/paste at will):"
echo '(BEWARE may delete precious data, run with caution.)'
echo '  docker system prune --all'
echo '  podman system prune --all'
echo '  git clean -ffdx'
