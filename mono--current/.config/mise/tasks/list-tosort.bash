#!/usr/bin/env bash
#MISE description="lists all tosort/ and ~~tosort/ dirs, sorted, 1 per line"

set -euo pipefail

echo "Executing task ${MISE_TASK_NAME:-$(basename "${BASH_SOURCE[0]}" .bash)}..." >&2

find . -type d \( -name node_modules -o -name .git \) -prune \
    -o -type d \( -name tosort -o -name '~~tosort' \) -print \
    | LC_ALL=C sort \
    | if [ -t 1 ]; then
        ## stripe = alternate bgYellow / bgRed whenever the top-level group (first N chars after "./") changes
        ## 22 = normal intensity, 30 = black fg (readable on both bgs), \033[K extends the bg to the full line width
        awk '{ group = substr($0, 2, 10); if (group != previous_group) is_red = !is_red; previous_group = group; print "\033[22;30;" (is_red ? "41" : "43") "m" $0 "\033[K\033[0m" }'
    else
        cat
    fi
