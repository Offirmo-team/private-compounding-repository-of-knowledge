<notes>
<critical>
Below are notes from a video course about working with Claude Code, Anthropic's command-line coding agent.
Use these notes as a resource to answer the user's question.
Write your answer as a standalone response - do not refer directly to these notes unless specifically requested by the user.
</critical>
<note title="Steering Long Sessions">
Long tasks (multi-file refactors, new features) can run for hours - two habits keep them on track: scope first, steer while running.

Scope with plan mode:
- Claude researches in read-only mode and hands you a plan to review before writing any code
- Actually read the plan, don't skim - a thorough plan means fewer surprises during execution
- Iterating on a plan is much faster than letting Claude run and cleaning up after

Steer with compaction:
- /compact summarizes the conversation, uses the summary as new context, deletes old messages
- Risk: something important gets dropped and Claude drifts
- Add instructions after the command to shape the summary (e.g., "/compact Focus on the --version flag implementation")

Rewind (recover from wrong paths):
- Every user prompt creates a checkpoint; double-tap escape on an empty prompt opens the rewind menu
- Options: restore code and conversation, restore conversation only, restore code only
- "Summarize from here" compresses everything after a checkpoint (good for side conversations)
- "Summarize up to here" compresses everything before it (good for long setup phases)

Autonomous options:
- /goal sets a completion condition - Claude keeps working across turns until a fast evaluator confirms the condition is met (e.g., "/goal all tests in src/billing pass, and the type checker reports zero errors"); /goal clear cancels
- Constraint: the evaluator only reads the transcript, so conditions must be checkable from output Claude produces (like test results)
- Loop runs a prompt on an interval between turns (fixed or self-paced) - useful for polling external state like CI or deploys; escape stops it

Parallel work with worktrees:
- Multiple sessions on one codebase conflict; worktrees give each session its own independent file tree
- Clean worktrees are auto-removed when a session exits
- A .worktreeinclude file at the repo root lists git-ignored files (env files, local config) to copy into each worktree

Essential Points:
- Scope first, then steer
- Direct compaction so summaries keep what matters
- Rewind to course-correct instead of prompting your way out
- Set a goal when you can describe "done" better than the steps
- Run parallel work in worktrees
  </note>

<note title="A CLAUDE.md That Follows">
CLAUDE.md = guidance, not enforced configuration. Every line competes with every other line for attention - the longer the file, the less reliably Claude follows any single rule.

First question: is CLAUDE.md the right surface?
- A hard rule like "never push to main" belongs in a PreToolUse hook, which stops the action even if Claude tries it
- CLAUDE.md and skills are instructions Claude follows; hooks are code that runs

Four memory locations, all loaded together:
1. Managed policy (org-wide, always in play)
2. User (your global preferences)
3. Project (shared with the team)
4. Local (just yours, in this project - e.g., holding your own architectural decisions during a refactor)

Imports:
- Split large files with path imports; Claude expands imported files inline at launch
- Imports organize content but do NOT reduce context - everything still loads up front

Phrasing rules that get followed:
- Be specific and checkable: not "follow best practices" but "put new API routes in src/api/handlers, one per file"
- Name the replacement: not "don't use default exports" but "use named exports, not default exports"
- Emphasis is a budget: IMPORTANT and "you must" raise priority only relative to quieter rules around them - spend on the 2-3 rules that hurt when broken

Keep the file under revision:
- When Claude does the wrong thing, treat it as a bug report against the file - tell Claude "add that to CLAUDE.md" and it writes the rule
- Treat CLAUDE.md like production code: if you can't justify a line, delete it

Essential Points:
- Lean file = more of it followed
- Move enforcement to hooks, organize with imports
- Scope task-specific conventions into skills so they load only when they apply
  </note>

<note title="Verification Skills">
Skill = a folder with a skill.md holding a name, a description that triggers it, and a procedure. Only descriptions load until a skill is needed.

The verification skill (the one to build first):
- Fires when its description matches (e.g., after Claude edits code)
- Runs the test suite, reads the diff, checks no test was weakened just to pass, reports pass/fail with evidence
- Checking work no longer depends on you remembering to ask

The same shape carries any repeated procedure: release checklists, migration recipes. If you've typed the same multi-step instruction twice, that's a skill.

Skill folder structure:
- skill.md stays lean - the entry point
- reference.md alongside for detailed material, linked from skill.md; Claude reads it only when it needs depth
- Scripts in the folder are executed rather than loaded, so a skill can carry its own tooling

The three instruction surfaces:
- Conventions that apply all the time: CLAUDE.md
- Procedures/reference material tied to a kind of task: skills
- Rules Claude must not be able to skip: hooks

Essential Points:
- Package every procedure you repeat; start with verification
- Check skills into .claude/skills so the whole team inherits them
  </note>

<note title="Permission Modes">
Permission modes decide once what Claude can run without asking. Shift-tab cycles the everyday ones; the status bar shows the current mode.

The modes:
- Manual: reads run without prompting; everything else asks
- Accept edits: reads, file edits, and common file-system bash commands run; for iterating on code you review after the fact
- Plan: read-only; researches and proposes without editing
- Auto: accepts everything, with a separate classifier model reviewing each action before it runs
- Don't ask: only pre-approved tools run; everything else is auto-denied with no prompt (right for CI and unattended pipelines - the run never hangs on an approval no one will give)
- Bypass permissions: skips all checks; equivalent to dangerously-skip-permissions - only run inside an isolated container or VM

How auto mode works:
- The classifier guards INTENT: designed to block moves that escalate beyond your request (production deploys and migrations, force pushes, piping downloaded code into a shell, sending sensitive data to external endpoints, destroying files outside the session)
- It allows everyday work: local edits in your project, installing dependencies from the lockfile, read-only requests, pushing to your own branch
- It never judges CORRECTNESS: broken code isn't dangerous, so it waves broken code through
- Pair auto mode with a stop hook that runs your tests - the classifier watches what Claude tries to do, the hook confirms the code actually works
- Auto mode guardrails are still evolving; check the docs for current block/allow lists

Essential Points:
- Match the mode to the job
- Auto is the hands-off mode: classifier checks intent before, stop hook checks correctness after
- Don't ask for unattended pipelines; bypass only inside isolated containers/VMs
  </note>

<note title="Hooks">
Hook = deterministic code at a fixed point in the loop. Turns "Claude usually listens" into "Claude can't skip it" - guarantees behavior even on runs you're not watching.

Claude Code fires around 30 hook events. The ones you'll reach for:
- PreToolUse: fires before a tool call - the enforcement primitive
- PostToolUse: fires after a successful tool call - where auto-format/auto-lint go
- Stop: fires when Claude wants to end its turn - refuse if conditions aren't met
- SubagentStop: same signal for a subagent finishing
- PreCompact/PostCompact: fire around compaction; to re-inject context after compaction use SessionStart with the compact matcher, not PostCompact
- InstructionsLoaded: fires when a CLAUDE.md or rule file loads - audit what made it into context
- SessionStart: primes the environment; check source=startup to run only on fresh starts

Controlling the loop with JSON (PreToolUse):
- Return JSON with exit 0 and a permissionDecision field: allow, deny, or ask
- A fourth value, defer, applies only to non-interactive -p runs (a calling process pauses and resumes the tool)
- updatedInput modifies the tool call without blocking (e.g., redact a secret from a bash command) - it replaces the WHOLE input object, so echo back fields you aren't changing

Exit codes (for hooks that don't return JSON):
- 0 = success; JSON on stdout is parsed; plain text is ignored on most events but added to context on SessionStart, UserPromptSubmit, and prompt expansion
- 2 = blocking error; stderr is fed back to Claude as context (blocks almost everywhere; exception: WorktreeCreate aborts on any non-zero)
- Anything else = non-blocking, just logged. Watch out: exit 1 feels like an error but does NOT block - Claude runs the command anyway
- Exit 2 can block Stop ("no, you're not done"); PostToolUse fires after the tool already ran, so it can't stop the call but can feed text back
- A few events ignore blocking (Notification, SessionStart, FileChange): stderr shown, execution carries on

Patterns:
- Guardrail that redacts instead of blocking: matcher picks the tool (e.g., bash), optional if-clause narrows to a command; deny stops it, updatedInput rewrites it so the command still runs without the secret
- Context preservation: SessionStart hook with compact matcher prints a short summary of working files right after compaction; the summary goes back into context so Claude picks up where it was

Essential Points:
- Reach past auto-formatting: guard tools with PreToolUse, gate the turn with Stop, preserve state across compaction
- Pays back the first time it catches something on an unwatched run
  </note>

<note title="Routines and Headless">
Once you trust Claude with a task, stop doing it by hand. Two paths: routines (build nothing) and headless mode / Agent SDK (full control).

Routines:
- A saved prompt + repositories + connectors that runs on Anthropic's managed infrastructure on a trigger: cron schedule, HTTP POST to its API endpoint, or a GitHub event (like a new PR)
- No machine of yours stays on; no workflow file to maintain
- Create from the web at claude.ai/code/routines or inside Claude Code (e.g., /schedule daily dependency audit at 9am)
- Fits anything that's the same prompt on a recurring trigger: morning dependency audits, PR triagers

Three limits before you rely on routines:
- Research preview - behavior and limits will keep moving
- Recurring schedules run at most hourly
- Each run starts from a fresh clone of your default branch and can only push to claude/-prefixed branches unless you loosen that per repo (the guardrail keeping autonomous runs from rewriting main)

Headless mode:
- The -p flag (alias --print) runs Claude Code as a one-shot command with no interactive TUI; reads stdin, writes stdout, pipes like any shell tool
- --bare skips auto-discovery of hooks, skills, plugins, MCP servers, and CLAUDE.md: you get Claude plus only the tools you allow explicitly; faster startup
- Structured output: pair a JSON schema with --output-format json and Claude constrains output to the schema; the result lands in the structured_output field - pull it with jq into a database or another script
- Multi-step automation: capture the session ID from JSON output and resume later with full context

Agent SDK:
- TypeScript and Python libraries embedding Claude Code in your own application
- Both expose a query function with the same primitives as the CLI: prompt plus options (allowed tools, system prompt, permission mode), then iterate the streamed messages

Essential Points:
- Routines are the default for repeat work (nothing to host)
- Drop to headless when the job needs your pipeline: -p to pipe data, --bare for deterministic CI runs, the SDK when the work belongs inside your own product
  </note>

<note title="GitHub Actions and Code Review">
The pull request is the best place to hand off repetitive work. Two paths: managed Code Review (turn it on) and the Claude Code GitHub action (wire it yourself).

Managed Code Review:
- Anthropic-hosted service reviewing PRs through the Claude GitHub app; nothing to build or host
- An org admin enables it from Claude Code admin settings, installs the app, picks repos and when it runs (PR open, every push, or on "@claude review" comments)
- Review agents analyze the diff against the full codebase and post findings as inline comments on specific lines, tagged by severity, with a summary table in the check run
- Deduplicates and ranks findings - a handful of real issues, not a wall of nits
- Never approves or blocks the PR; judgment stays with a human
- Research preview, currently for Team and Enterprise plans
- No managed autofix - the service posts findings only; apply them locally with /code-review and its --fix flag

The GitHub action (beyond review):
- For implementing changes from a comment, scheduled reports, anything you'd write a workflow for
- /install-github-app (needs repo admin) walks through installing the app and setting the API key secret
- The action is anthropics/claude-code-action@v1
- Inputs: anthropic_api_key, github_token (defaults to secrets.GITHUB_TOKEN), trigger_phrase (defaults to @claude), provider switches for Bedrock/Vertex, prompt, and claude_args (CLI arguments passed through)
- A workflow listening for @claude on PR/issue comments: someone writes "@claude implement the spec in the linked issue" and the action picks it up, pushes commits, posts comments
- A cron rollup: schedule fires (e.g., 9am UTC), action runs, Claude posts results; workflow_dispatch also allows manual runs from the Actions tab
- Tuning via claude_args: max turns caps the agent loop, permission mode "don't ask" for unattended runs, allowed tools scoped to the job (read-only for a report)

Essential Points:
- Take the managed path for PR review; apply fixes locally with /code-review --fix
- Reach for the action when the job is more than review
  </note>

<note title="Trust It: Verifying Unsupervised Runs">
Verification makes hands-off Claude Code safe to rely on. Verify in proportion to how unsupervised the run was: a watched session needs a glance; an unattended or CI run needs a real check because nobody saw it happen.

Ground rules for unattended runs:
- Keep them in auto mode, not bypass - the classifier still reviews each action for danger
- The classifier never judges correctness, so the verification bar stays where it was

Start from the diff, not the summary:
- Run /code-review to walk the changes and flag issues, then put your eyes on git diff
- The trap: a tidy summary that reads fine while the diff touched files you didn't expect
- Read what changed; read the files that were in the plan first

Make tests the real gate:
- The question is whether tests passed AND whether Claude actually ran them or only claimed to - don't leave that to trust
- Wire it as a hook: a Stop hook that runs the tests and refuses to end the turn on failure, or a PostToolUse hook that lints and type-checks after every edit
- A hook exiting with code 2 feeds the failure straight back to Claude, which reads it and fixes it unprompted
- The check fires on every run whether or not you remember to ask

Cold second opinion:
- Open a fresh session or subagent to review the changed code with no memory of how it was built
- It has no stake in the approach and catches what the original run talked itself past

Headless runs:
- Verify by their JSON result and exit code

Essential Points:
- The less you watched, the more you verify
- Diff first, tests as a hook-enforced gate, fresh-context review for anything that matters
  </note>

<note title="Plugins">
Plugins are how Claude Code packages a setup and moves it between people. Two sides: using published plugins, and packaging your own.

What a plugin is:
- One installable unit bundling skills, subagents, hooks, and MCP server configs, plus LSP servers, background monitors, themes, and a slice of settings.json
- Install directly: /plugin install org-name@plugin-name (then /reload-plugins)
- For a team, add a private marketplace once: /plugin marketplace add your-org/claude-plugins - every install after that resolves through it (centralized discovery, version tracking, updates); browse via the Discover tab

Read before you install:
- A plugin runs code on your machine with your privileges; its hooks fire on every matching tool call
- Install for the skills and you also get its PreToolUse and Stop hooks, whether you read them or not
- A community plugin could ship a Stop hook that calls a network endpoint every time with no warning from your configuration
- The in-app submission form posts to the community marketplace after Anthropic's automated review; the official marketplace is curated separately
- Reviewed is NOT the same as trusted - automated review catches some things, not everything
- Check the plugin's details: Claude Code shows what it will install and estimates context cost

Components run alongside yours:
- Hooks stack: a plugin's PreToolUse hook and your own both fire on every tool call - neither replaces the other
- Skills, agents, and commands are namespaced under the plugin name, so they never clash
- A plugin's settings.json is honored narrowly: only the agent and subagent status line keys
- The agent key promotes one of the plugin's subagents to the main thread (its system prompt, tool restrictions, and model) - enabling the plugin can change how Claude Code behaves by default

Packaging your own:
- Same .claude shape you already use: one folder per skill, one markdown file per subagent under agents/, hooks/hooks.json and .mcp.json at the plugin root - components discovered by directory convention
- Optional manifest at .claude-plugin/plugin.json with name, version, description, author
- Name is the only required field; it namespaces skills as plugin-name:skill-name
- Version it like any other dependency

Essential Points:
- Read before you install: check every hook, agent, and MCP server a plugin adds
- Package your .claude the moment it works - one manifest, one install, the whole team inherits it
  </note>
  </notes>
