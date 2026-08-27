#!/usr/bin/env bash
#MISE description="cleans deeper, potentially removing local data (ex. env) to fix a broken setup or starting fresh"
#MISE depends=["clean"]

set -euo pipefail

find . -type f \( \
		-name .dev.vars \
		-o -name .test.vars \
	\) \
	-exec rm -rf {} +

## More suggestions for cleaning one's local env:
# sudo podman system prune --all
# git clean -ffdx
