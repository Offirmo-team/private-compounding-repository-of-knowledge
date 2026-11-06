### G1-P6-01 — Major: hard Node-only dependency breaks the package's own isomorphic/"winter" claim

`module/src/options--display.ts` does:

```ts
import getꓽterminal_size from "terminal-size"
...
const OPTIONS__DISPLAYⵧDEFAULT: DisplayOptions = {
	max_width‿charcount: getꓽterminal_size().columns,
	...
```

This is called unconditionally at module load time. `terminal-size`'s implementation (`node_modules/terminal-size`)
internally uses `node:child_process` (`execFileSync`), `node:fs`, and `node:tty` — none of which exist in browsers or in
"winter"/edge runtimes (e.g. Cloudflare Workers). The package lives under `2-engine--winter` specifically for
winter/edge-runtime compatibility (per `2-engine--winter/README.md`: "node-like but made specifically for
winter/cloudflare"), and the README/notes explicitly say the goal is "node or browser" and that the lib is designed "to
be runtime agnostic" (see `injectable-lib--chalk.ts`: "to make this lib isomorphic, we allow dependency injections").
`chalk` was given exactly this injectable treatment ("chalk is not 'winter CG' compatible (Cloudflare)"), but
`terminal-size` — which relies on far more restrictive Node built-ins than chalk — was not, and is imported eagerly with
no guard/dynamic-import/injection fallback. This will throw or fail to bundle in browser/edge targets.
`module/MANIFEST.json5` even marks `terminal-size` as `{ type: "optional" }` in its `_overrides.dependencies`, but the
generated `package.json` lists it as a plain (required) `dependencies` entry and the code treats it as mandatory — the
manifest's intent and the actual code disagree.

### G1-P6-05 — Nit: `State.circular` typed as `WeakSet<object>` but silently becomes a `Set<object>` at runtime

`module/src/types.ts` types `State.circular` as `WeakSet<object>`, but `module/src/options--prettify.ts` (in both
`prettifyꓽarray` and `prettifyꓽobjectⵧkeyⳇvalue`) reassigns it via:

```ts
circular: new Set([...Array.from(st.circular as any), a])
```

`WeakSet` has no iterator/length, so `Array.from` on it silently yields `[]` — the `as any` cast papers over this. It
only "works" today because the set is always freshly created empty in `v2.ts` (`new WeakSet<object>()`) and only
`.has()` is ever consulted, so nothing is currently lost. But the type is misleading (it is really a `Set<object>` after
the first level) and the pattern is fragile: any future code path that seeds `circular` with pre-existing entries would
silently lose them. Simplify by typing/using `Set<object>` from the start and dropping the `as any`.

### G1-P6-06 — Nit: dead `case "number"` branch in `prettifyꓽproperty__name`

`options--prettify.ts`'s `prettifyꓽproperty__name` switches on `typeof p` and has a `case "number":` branch, but its
only real call site passes keys from `Reflect.ownKeys(obj)` (`options--prettify.ts:191`), which per spec always returns
`string | symbol` — object property keys are never actual `number` primitives in JS. The branch is unreachable via the
current call path (harmless, but dead).

### G1-P6-07 — Nit: `remaining_width‿charcount` is tracked but never read

`_increase_indentation` (`options--prettify.ts`) decrements `remaining_width‿charcount` on every nesting level, and it's
initialized in `v2.ts`, but no code ever reads it to make a wrapping/truncation decision. This is consistent with the
`DisplayOptions.max_width‿charcount` field being explicitly commented `// NOT IMPLEMENTED TODO` in `types.ts` — it's
tracked state for a feature that was never finished, effectively dead today.
