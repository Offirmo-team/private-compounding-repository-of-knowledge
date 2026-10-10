#!/usr/bin/env bash
# Reports the forbidden keywords found in the files under the current dir = tracked + untracked-unignored - IGNORED_PATHS.
# Keywords are tested one by one, in order, case-insensitively, as literal strings (not regexes).
# Long lines (ex. minified files) are not displayed in full, only excerpts around the matches.
# Some matches are legit, so finding some is NOT an error: exit code is 0 unless misconfigured or git fails.
# Usage, from the git root to check the whole repo:
#   FORBIDDEN_KEYWORDS="acme, Project Phoenix" ./scripts/check-forbidden-keywords.bash
# Keywords are comma or newline separated, surrounding whitespace is trimmed:
#   export FORBIDDEN_KEYWORDS="
#      acme
#      project phoenix
#      john.doe@example.com
#   "
#   ./scripts/check-forbidden-keywords.bash
set -euo pipefail

# relative to the git root, globs allowed ex. '**/*.min.js' but MUST be quoted, or bash would expand them
readonly -a IGNORED_PATHS=(
	'mono--web3/X-spikes/lib--bip39/bip39-standalone.html'
)
# git caps regex repetitions at 255
readonly MAX_FULLY_DISPLAYED_LINE_LENGTH=250
readonly EXCERPT_CONTEXT_LENGTH=80
# --untracked honors .gitignore + .git/info/exclude + core.excludesFile by default
readonly -a GIT_GREP_FLAGS=(--untracked -I --ignore-case --extended-regexp --line-number)
# "." = the current dir, also keeps the array non-empty: bash 3.2 + `set -u` chokes on empty arrays
readonly -a GIT_GREP_PATHSPECS=(. ${IGNORED_PATHS[@]+"${IGNORED_PATHS[@]/#/:(top,exclude,glob)}"})

main() {
	local keywords
	keywords="$(list_keywords "${FORBIDDEN_KEYWORDS:-}")"
	if [[ -z "$keywords" ]]; then
		echo "FORBIDDEN_KEYWORDS is unset or empty" >&2
		exit 2
	fi

	# matches are captured before being displayed, which would disable git's auto color
	local git_color=never
	if [[ -t 1 ]]; then git_color=always; fi

	local keyword_count
	keyword_count="$(wc -l <<< "$keywords" | tr -d ' ')"
	echo "🔍 checking $keyword_count forbidden keywords, in order:"
	awk '{ printf "   %d. %s\n", NR, $0 }' <<< "$keywords"
	if (( ${#IGNORED_PATHS[@]} > 0 )); then
		echo "🙈 ignoring ${#IGNORED_PATHS[@]} paths:"
		printf '   - %s\n' "${IGNORED_PATHS[@]}"
	fi

	local found_count=0
	local keyword
	while IFS= read -r keyword; do
		if report_keyword_matches "$keyword" "$git_color"; then
			found_count=$((found_count + 1))
		fi
	done <<< "$keywords"

	echo
	if (( found_count == 0 )); then
		echo "✅ no forbidden keywords found"
	else
		echo "⚠️  $found_count/$keyword_count forbidden keywords found, review the matches above"
	fi
}

# blanks MUST be dropped: an empty pattern matches every line
list_keywords() {
	tr ',' '\n' <<< "$1" \
		| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' \
		| { grep -v '^$' || true; }
}

# like grep: returns 0 if found, 1 if not
report_keyword_matches() {
	local -r keyword="$1" color="$2"
	local keyword_regex
	keyword_regex="$(escape_extended_regex "$keyword")"

	local short_lines_status=0 short_lines_matches
	short_lines_matches="$(grep_short_lines "$keyword_regex" "$color")" || short_lines_status=$?
	exit_if_git_grep_failed "$short_lines_status"

	local long_lines_status=0 long_lines_excerpts
	long_lines_excerpts="$(grep_long_lines_excerpts "$keyword_regex" "$color")" || long_lines_status=$?
	exit_if_git_grep_failed "$long_lines_status"

	if (( short_lines_status == 1 && long_lines_status == 1 )); then
		return 1
	fi

	printf '\n⚠️  "%s":\n' "$keyword"
	if (( short_lines_status == 0 )); then
		printf '%s\n' "$short_lines_matches"
	fi
	if (( long_lines_status == 0 )); then
		printf '   ✂️  excerpts of long lines:\n%s\n' "$long_lines_excerpts"
	fi
}

escape_extended_regex() {
	sed 's#[][\.*^$+?(){}|]#\\&#g' <<< "$1"
}

exit_if_git_grep_failed() {
	local -r status="$1"
	if (( status > 1 )); then
		echo "git grep failed (exit $status)" >&2
		exit "$status"
	fi
}

grep_short_lines() {
	local -r keyword_regex="$1" color="$2"
	git grep "${GIT_GREP_FLAGS[@]}" "--color=$color" \
		-e "$keyword_regex" --and --not -e ".{$((MAX_FULLY_DISPLAYED_LINE_LENGTH + 1))}" \
		-- "${GIT_GREP_PATHSPECS[@]}"
}

# - the keyword is tested 1st for speed: --and is lazy and the excerpt regex is slow on huge lines
# - --only-matching prints the longest match of all patterns = the excerpt
# - the excerpt is not highlighted since it would be highlighted in full
grep_long_lines_excerpts() {
	local -r keyword_regex="$1" color="$2"
	local -r context=".{0,$EXCERPT_CONTEXT_LENGTH}"
	git -c color.grep.matchSelected=normal grep "${GIT_GREP_FLAGS[@]}" "--color=$color" --only-matching \
		-e "$keyword_regex" --and --not -e "^.{0,$MAX_FULLY_DISPLAYED_LINE_LENGTH}$" --and -e "$context$keyword_regex$context" \
		-- "${GIT_GREP_PATHSPECS[@]}"
}

main "$@"
