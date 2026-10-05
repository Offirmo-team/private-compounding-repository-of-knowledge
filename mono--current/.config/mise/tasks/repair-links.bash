#!/usr/bin/env bash
#MISE description="ensures the committed symlinks exist and point to their (relative) target, ex. after moving files around"

set -euo pipefail

echo "Executing task ${MISE_TASK_NAME:-$(basename "${BASH_SOURCE[0]}" .bash)}..."


main() {
	cd "$(dirname "${BASH_SOURCE[0]}")/../../.."


	## We use a few targeted symlinks in this repo to break dependency loops.
	## If published, those modules would be independent.
	## ensure_symlink ORIGIN LINK (same order as ln, paths relative to mono--current/)

	ensure_symlink \
		S-skus/@infinite-monorepo/plugin--typescript/module/tsconfigs/strictest \
		0-meta/config--typescript/module/_vendor/strictest

	ensure_symlink \
		1-isomorphic/1-libs--simple/type-detection/module/01-primitives/index.ts \
		2-engine--winter/prettify-any/module/src/__vendor/@monorepo-private/type-detection/index.ts

	ensure_symlink \
		4-engine--browser/1-libs--simple/css--1-foundation/module/src/root/box-model.css \
		4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/css--foundation/root/box-model.css
	ensure_symlink \
		4-engine--browser/1-libs--simple/css--2-framework/module/src/atomic/atomic--dimension.css \
		4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/css--framework/atomic/atomic--dimension.css
	ensure_symlink \
		4-engine--browser/1-libs--simple/react--fake-inset/module/src/index.tsx \
		4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/react--fake-inset/index.tsx

	ensure_symlink \
		4-engine--browser/1-libs--simple/assets--background/module/licensed/LisadiKaprio/sunny-sky \
		4-engine--browser/1-libs--simple/react--background-img/module/__fixtures/sunny-sky
	ensure_symlink \
		4-engine--browser/1-libs--simple/assets--background/module/licensed/Offirmo/two-travelers \
		4-engine--browser/1-libs--simple/react--background-img/module/__fixtures/two-travelers

	echo "↳ Done."
}

ensure_symlink() {
	local -r origin="$1"
	local -r link="$2"

	if [[ ! -e "$origin" ]]; then
		echo "  ✗ $link: origin not found: $origin" >&2
		return 1
	fi
	if [[ -L "$link" && "$link" -ef "$origin" && "$(readlink "$link")" != /* ]]; then
		echo "  ✓ $link"
		return 0
	fi
	if [[ -e "$link" && ! -L "$link" ]]; then
		echo "  ⚠ $link: exists but is NOT a symlink, overwriting it"
	fi

	mkdir -p "$(dirname "$link")"
	rm -rf "$link"
	gln --symbolic --relative "$origin" "$link"
	echo "  ↻ $link -> $(readlink "$link")"
}


main "$@"
