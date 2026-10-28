## Concepts

Familiarize yourself with the following concepts:

- monorepo
- functional programming
  - immutability
  - pure functions https://react.dev/learn/keeping-components-pure
- js modules: ESM
- TypeScript
- flux architecture
- isomorphic
- ontology (software) = a formal, structured representation of a specific domain. It defines a shared vocabulary of
  classes, properties, and relationships to help computer systems organize and reason about data, such as technical
  terms or enterprise knowledge graphs.
  https://protege.stanford.edu/publications/ontology_development/ontology101-noy-mcguinness.html
- ponyfills
- modules vs. packages
  - Module = usually a single file containing code.
  - Package = a collection of related modules, usually organized in a directory.
  - Package → contains modules → contain functions/classes/variables.
- Arguments vs. Parameters
  - Parameter = the variable in the function definition
  - Argument = the actual value you pass when calling the function
  - `function greet(params: GreetParams) {}`
  - `greet({ name: "Alice", age: 20 });` <- arguments
- undesired dependencies between layers
- contamination of user interface code with business logic
- "progressive resurrection"
  - "resurrection" as in "we broke everything OR we're back to this monorepo and forgot everything" and we're going
    across all packages one by one, fixing and reviewing what they do (and sometimes pruning them, e.g. a polyfill that
    is now baseline available)
  - Past examples: new tooling such as pnpm, new backward-incompatible syntax such as ESM, new backward-incompatible
    major tool version such as TypeScript
