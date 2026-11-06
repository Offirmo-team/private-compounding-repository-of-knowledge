//<node-interpreter>project</node-interpreter> // TODO unit test of this

import { manifestꓽᐧgitignore } from '@infinite-monorepo/plugin--git'

.idea/\* !.idea/dictionaries/

https://viteplus.dev/guide/ide-integration#jetbrains-intellij-webstorm-etc

## Run configurations

2026-11 ported from the legacy generator `70-operation--apply/module/~~tosort/2026/pure-module--presenter`

- `webstorm--tests--unit.run.xml` = Vitest (`JavaScriptTestRunnerVitest`), for packages with unit tests + `vitest` dev
  dep
  - otherwise "not-present" (also cleans up the legacy mocha ones)
  - name `<fqname> -- TESTS -- UNIT` kept = WebStorm replaces the old entry
  - vitest options mirror the `test--vitest` script from plugin--pm--package-json (TODO SSoT)
  - no `node-options`, same as the `test--vitest` script
- paths = `$PROJECT_DIR$/<path from git repo root>`
  - ASSUMPTION: the JetBrains project is opened at the git repo root (fallback: monorepo root if no repo node)
  - legacy used `$USER_HOME$/…` = broke when the repo moved (all legacy files pointed to
    `offirmo/offirmo-monorepo/stack--current`)
- TODO demo / sandbox / start run configs (legacy ones are still there, stale paths)
