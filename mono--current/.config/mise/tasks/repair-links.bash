#!/usr/bin/env bash
#MISE description="deletes all symlinks then re-creates the committed ones with their (relative) target, ex. after moving files around"

set -Eeuo pipefail

readonly TASK_NAME="${MISE_TASK_NAME:-$(basename "${BASH_SOURCE[0]}" .bash)}"
trap 'fail "unexpected error running: $BASH_COMMAND"' ERR

echo "Executing task $TASK_NAME..."


main() {
	cd "$(dirname "${BASH_SOURCE[0]}")/../../.."

	delete_all_symlinks_outside_node_modules


	## We use a few targeted symlinks in this repo to break dependency loops.
	## If published, those modules would be independent.
	## ensure_symlink ORIGIN LINK (same order as ln, paths relative to mono--current/)

	ensure_symlink \
		S-skus/@infinite-monorepo/plugin--typescript/module/tsconfigs/strictest \
		0-meta/config--typescript/module/_vendor/strictest

	ensure_symlink \
		1-isomorphic/1-libs--simple/1-type-detection/module/01-primitives/index.ts \
		2-engine--winter/prettify-any/module/src/__vendor/@monorepo-private/type-detection/index.ts


	#ensure_symlink \
	#	4-engine--browser/0-dev-tools/css--utils--diagnostics/module/src/index.css \
	#	4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/css--utils--diagnostics/index.css
	#ensure_symlink \
	#	4-engine--browser/1-libs--simple/browser-features-detection/module/src/l1-is-framed/index.ts \
	#	4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/browser-features-detection/is-framed/index.ts
	#ensure_symlink \
	#	4-engine--browser/1-libs--simple/css--1-foundation/module/src/root/box-model.css \
	#	4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/css--foundation/root/box-model.css
	#ensure_symlink \
	#	4-engine--browser/1-libs--simple/css--2-framework/module/src/atomic/atomic--dimension.css \
	#	4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/css--framework/atomic/atomic--dimension.css
	#ensure_symlink \
	#	4-engine--browser/1-libs--simple/react--fake-inset/module/src/index.tsx \
	#	4-engine--browser/0-dev-tools/storypad/module/src/__vendor/@monorepo-private/react--fake-inset/index.tsx

	ensure_symlink \
		4-engine--browser/X-incubator/active/assets--background/module/src/licensed/LisadiKaprio/sunny-sky \
		4-engine--browser/1-libs--simple/react--background-img/module/__fixtures/sunny-sky
	ensure_symlink \
		4-engine--browser/X-incubator/active/assets--background/module/src/genai/Offirmo/two-travelers \
		4-engine--browser/1-libs--simple/react--background-img/module/__fixtures/two-travelers

	echo "↳ Done."
}

delete_all_symlinks_outside_node_modules() {
	# NOT `-delete`: it implies `-depth`, which disables `-prune` = would wipe pnpm's node_modules symlinks
	find . -name node_modules -prune -o -type l -print -exec rm -- {} + \
		| sed 's|^\./|  ✗ |'
}

ensure_symlink() {
	local -r origin="$1"
	local -r link="$2"

	if [[ ! -e "$origin" ]]; then
		fail "$link: origin not found: $origin (moved/renamed? update it in this script)"
	fi
	if [[ -e "$link" ]]; then
		echo "  ⚠ $link: exists but is NOT a symlink, overwriting it"
	fi

	mkdir -p "$(dirname "$link")"
	rm -rf "$link"
	gln --symbolic --relative "$origin" "$link"
	echo "  ↻ $link -> $(readlink "$link")"
}

fail() {
	echo "❌ Task $TASK_NAME FAILED: $1" >&2
	exit 1
}


main "$@"
