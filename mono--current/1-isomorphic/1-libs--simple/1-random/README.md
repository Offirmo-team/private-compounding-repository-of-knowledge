# @Offirmo/random

**This used to be an improved fork of [Random.js](https://github.com/ckknight/random-js) adding ES6 and typescript
compatibility. Hat tip to original author!👒**

**This has now (2023) been totally rewritten, drawing strong inspiration from the architecture and logic**

**WARNING THIS RNG LIB MAKES NO CLAIM OF CORRECTNESS / BEING CRYPTOGRAPHICALLY SECURE, IT'S MAINTAINED BY A
NON-SCIENTIST FOR WRITING GAMES!**

Pitch: a mathematically correct pseudo random number generator library for JavaScript:

- no dependencies
- generating various distributions of random values (over the default Math.random())
- correct random generation (easy to make wrong when using Math.Random)
- Optional PSEUDO-random generation (useful for repeatability, esp. in unit tests but also for speed runs)
  - the state is savable/restorable
  - includes the fast and (claimed) cryptographically secure ISAAC PRNG
- avoid causing a huge bundle by requiring node crypto

Interface change from Random.js

- only 1 interface
  - We keep the "inconvenient" interface with the potential of the highest speed (as much pre-computation as possible)
- parameters type enforcement (no affordances)
- better naming
- better structure/readability
- native TypeScript
- native ESM

```ts
import { getꓽengine, RNGEngine } from '@monorepo-private/random'
const rng = getꓽengine.for_unit_tests()
const rng = getꓽengine.for_unit_tests()

import { getꓽrandom, RNGEngine } from '@monorepo-private/random'
const gen = getꓽrandom.generator_of.integer.between(1, 1000)
const gen = getꓽrandom.picker.of(ARMOR_BASES)
const gen getꓽrandom.generator_of.integer.in_interval(BASE_STRENGTH_INTERVAL_BY_QUALITY[quality]!)
v = gen(rng)

```

TODO review https://stackoverflow.com/questions/4720822/what-is-the-best-pseudo-random-number-generator-as-of-today TODO
review https://github.com/davidbau/seedrandom TODO review https://github.com/sindresorhus/randoma TODO review
https://github.com/ChrisCavs/aimless.js
