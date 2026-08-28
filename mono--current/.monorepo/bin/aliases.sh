#@IgnoreInspection BashAddShebang
[[ "$VERBOSE__RC" == true ]] && echo "$(date +%H:%M:%S)   ↳ […monorepo/…/aliases.sh] hello!"

## default = where "gitc" is supposed to clone it
export MONOREPO_ROOT__CURRENT=${MONOREPO_ROOT__CURRENT:-"$HOME/work/src/x-external/off/offirmo-team/private-compounding-repository-of-knowledge/"};
