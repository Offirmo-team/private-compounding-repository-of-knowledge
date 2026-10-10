---
name: lint-mm-txt
description:
  Lint, normalize and enrich a `*.mm.txt` notes file (1 line = `[terminology breadcrumb] = [short summary] [optional
  links]`). Use when asked to lint, clean up, review, normalize or enrich a `.mm.txt` / "memes" notes file, ex. fix
  accidentally split lines, add short summaries or Wikipedia links, translate French terms, normalize acronyms.
---

# Lint `.mm.txt` notes

`N-notes/*.mm.txt` = the human's knowledge notes, one entry per line, roughly:

```
[term breadcrumb] = [very short summary] [links…]
```

- breadcrumb = segments separated by `--` with a space on each side, most general first, ex.
  `incentive -- perverse -- cobra effect`
- a parent line may be explained by its children lines, ex. `T-Shape -- generalist = …`
- `[ ] …` lines = the human's TODO inbox: mechanical fixes only
- exceptions exist (quotes, adages, numbered list items): don't force the format onto them
- files are roughly sorted alphabetically: do NOT re-sort, keep edited lines in place (the human re-sorts)

## Collaboration contract

- The human reviews every change in a diff and discards the incorrect ones → precision over recall. In doubt, don't
  edit: report.
- Do NOT stage or commit.
- The human may be editing the same file → never edit by line number: apply judgment edits with `apply-edits.ts`
  (content-matched, all-or-nothing).

## Procedure

Scripts are in `scripts/` next to this file (Node ≥ 24 runs `.ts` directly), below
`S=.agents/skills/lint-mm-txt/scripts`

Target = the file(s) named by the human. If none, ask (the mechanical pass alone can run on all `N-notes/*.mm.txt`).

1. Mechanical pass: `node $S/lint.ts fix <files…>` (dry run: `check`). Deterministic, no judgment:
   - collapse whitespace runs to a single space, trim lines
   - no empty lines, exactly 1 final newline
   - `vs.` → `vs` (outside URLs)
   - strip tracking query params from URLs (`utm_*`, `fbclid`, `_bhlid`, LinkedIn `rcm`, YouTube `si`, X `s`/`t`…).
     Extend the lists in `lint.ts` when meeting a new unambiguous tracker. Params that may be meaningful (ex. `ref`,
     `sort`) → leave them.
2. Hints: `node $S/lint.ts hints[=category,…] <file>` lists candidate lines for the judgment rules below (categories:
   `fragment`, `unbalanced`, `colon`, `alt`, `french`, `case`, `no-summary`, `no-wikipedia`). Heuristics with false
   positives: you decide. Big categories (`case`, `no-summary`, `no-wikipedia`) → read them in chunks.
3. Judgment pass: apply the rules J1-J9 below. Collect the edits in a JSON file (`$TMPDIR`), then
   `node $S/apply-edits.ts <file> <edits.json>` (run without args for the format: `line`/`prefix` selector +
   `replace`/`delete`/`summary`/`append` action). It aborts without writing on any ambiguous or missing selector → fix
   the edits and re-run.
4. Re-run step 1 (edits may have introduced issues).
5. Report, see below.

## Judgment rules

### J1 accidentally split lines

An orphan fragment (ex. `in which it slumbers`) got sorted away from its parent line, which now ends mid-phrase.

- Find the parent: grep related words, `git log -S'<fragment>' --format='%h %ad %s' -- <file>` then
  `git show <commit> -- <file>`: lines added in the same commit are the best candidates (ex. other notes from the same
  source).
- Rejoin (`append` to the parent + `delete` the fragment) only when the joined sentence is clearly right (ex. matches
  the source's wording). Otherwise report.

### J2 unbalanced parentheses / quotes

Close them when the intent is obvious (ex. `… himself (Nietzsche` → `… himself (Nietzsche)`). Otherwise report: it may
be another split line (J1).

### J3 `breadcrumb: summary` → `breadcrumb = summary`

Only when the text before the colon is a term breadcrumb (`inversion: Avoiding stupidity…` →
`inversion = Avoiding stupidity…`). Not mid-sentence (`…ask yourself: Is it…`), not in a title
(`Decisive: How to Make Better Choices`).

### J4 lowercase breadcrumbs

Breadcrumbs should be fully lowercase, unless case is significant:

- keep: proper nouns (`Fermi paradox`, `Holodomor`), acronyms (`DEI`), titles of works (`Profiles in Courage`), quotes
  and adages
- lowercase: `Horseshoe Theory` → `horseshoe theory`, `Logical Problem of Evil` → `logical problem of evil`

Breadcrumbs only: never change the case of summaries or quotes.

### J5 alternate names: `short (alt)`

A segment may be `short (alt)` or `short "alt"`. If one of them is an acronym or a well-known shorter version: the
shorter one first, the longer one in parentheses.

- `fear of missing out (FOMO)` → `FOMO (fear of missing out)`
- `CHLCA "chimpanzee–human last common ancestor"` → `CHLCA (chimpanzee–human last common ancestor)`
- `DYOR "do your own research"` → `DYOR (do your own research)`
- the expansion follows J4 (lowercase unless proper nouns)
- check that the expansion is correct, ex. FUD = fear, uncertainty, **doubt** (not "death"), RICE = reach, impact,
  confidence, **effort** (not "estimate")

Not an alt: quotes (`identity -- "I’d tied my identity…"`), titles (`Byron Katie's "The Work"`).

### J6 French → English

When a term is in French and has a clear English equivalent, translate it: `effet projecteur` → `spotlight effect`,
`normalisation de la déviance` → `normalization of deviance`, `herbe toujours plus verte` →
`the grass is always greener`.

Keep the French when there is no clear equivalent (idioms, nuances) or the concept is France-specific
(`Affaire Empain`). Applies to terms (breadcrumbs, terms inside summaries), not to French sentences or quotes.

### J7 very short summaries, for really non-obvious terms only

Add ` = <summary>` (`summary` action: inserted before the 1st URL) ONLY when the name gives no clue of the meaning:
jargon, eponyms, proper nouns, references, acronyms. The human explicitly does NOT want noise:

- skip: famous or self-explanatory terms (`black swan`, `cargo cult`, `herd immunity`), parents whose children already
  explain them, quotes, adages, list items, `[ ]` lines
- very short (≤ ~15 words), factual, English, no fluff. Attribution in parentheses when useful (`(Taleb)`)
- only when confident. Medium confidence → add it but list it in the report for a second look
- term-less lines (`debate -- <url>`): add the term when the URL makes it unambiguous
  (`debate -- principle of charity = interpret others' arguments in their strongest form <url>`)

Examples:

```
Baptists and Bootleggers = unlikely coalition backing a regulation: moralists for virtue, profiteers for gain (ex. Prohibition) https://…
Goldwater rule = psychiatrists shouldn't diagnose public figures they haven't examined https://…
equality -- gender -- Scully effect = Dana Scully (The X-Files) inspired women to enter STEM
```

### J8 Wikipedia link

When a line has no Wikipedia link and an article exactly matches the concept, append the link.

- NEVER write a Wikipedia URL from memory. Verify with `NODE_USE_ENV_PROXY=1 node $S/wikipedia.ts <term>…` (or 1 term
  per line on stdin, batch them all in 1 call) and copy the final URL it prints: redirects are resolved to the final
  page, section anchors kept.
- statuses:
  - `page` ✅
  - `redirect` ✅ only if the target IS the concept (synonym, or a section dedicated to it). ❌ if it is a broader
    article, ex. `cobra effect` → `Perverse incentive`
  - `missing` / `disambiguation` / `invalid` ❌. You may retry a qualified title (ex. `Rout (social)`), verified again
- the article must be about the same sense as the note (`grit` the trait, not the material)
- 1 link per concept: on the parent line when the concept has children lines. Skip if a sibling line already links it
- skip generic everyday words where the article adds nothing (`acceptance`, `ego`)
- `en` by default, `--lang=fr` only for France-specific concepts without an English article

### J9 obvious typos

In breadcrumbs, fix the obvious ones (`feedworward` → `feedforward`). Report the less obvious ones.

## Report

Concise:

- what was done, per rule, with counts
- the edits worth a second look (medium confidence)
- the remaining issues NOT fixed, each with a unique id (`I1`, `I2`…) and its current line number: garbled or duplicated
  text, duplicate entries, URL-only lines without a term, suspected fragments without a confident parent…
