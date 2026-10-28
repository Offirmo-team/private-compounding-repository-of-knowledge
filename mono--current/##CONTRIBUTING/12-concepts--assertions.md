## assertions

In the spirit of [Design by contract](https://en.wikipedia.org/wiki/Design_by_contract) This repo uses advanced
assertions, with precise semantics.

We use a dedicated lib providing the core assertions:

- pre/require
- assert
- post/ensure

require → operation → ensure

- require(x > 0) — caller must give me a positive x.
- ...(perform operation)
- ensure(result >= 0) — I promise my result satisfies this. Whereas:
- assert(balance >= 0) — according to the program's logic, this cannot be false; if it is, we have a bug.

Overall:

| Term          | Typical meaning                                         | Best used when                                            |
| ------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| **assert**    | “This should already be true; otherwise there’s a bug.” | Internal invariants / programmer assumptions              |
| **require**   | “This must be true before proceeding.”                  | Preconditions, especially caller obligations              |
| **ensure**    | “I guarantee this will be true afterward.”              | Postconditions / guarantees                               |
| **validate**  | “Check whether this input satisfies rules.”             | User/external/untrusted input                             |
| **verify**    | “Check that something is actually/correctly true.”      | Explicit confirmation, often external state/results       |
| **check**     | Generic “inspect/test this condition.”                  | When you don't want stronger semantics                    |
| **expect**    | “This is the anticipated result.”                       | Tests/specifications, especially assertions about outputs |
| **enforce**   | “Make sure this rule cannot be violated.”               | Policies, permissions, constraints                        |
| **guarantee** | Strong promise that a property holds                    | Documentation/contracts rather than function naming       |
