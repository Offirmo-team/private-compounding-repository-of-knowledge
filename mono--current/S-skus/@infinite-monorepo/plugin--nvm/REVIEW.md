# Review: plugin--nvm

Writes `.nvmrc` with the major Node version, derived from the local runtime's acceptable semver range.

## Findings

No significant issues found. This is the original/correct source of the `.nvmrc` doc links (nvm-sh/nvm, npmjs nvmrc,
nvmnode.com) that were mistakenly copy-pasted into `plugin--license` (see that package's REVIEW.md, finding G10-P1-01).
The early-return guard on non-"node" runtimes and the semver-major computation are both correct.

Minor/nit-level notes, not worth a severity tag on their own:

- Dangling TODO `// TODO 1D any node where parent node != current node`.
- Deliberate commented-out dead code in the default case, matching the same documented "what if overlapping nodes?"
  rationale seen in `plugin--git` — intentional, not a bug.
