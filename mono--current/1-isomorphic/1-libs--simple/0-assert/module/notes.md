Goals:

- more semantic
- auto error messages

Concepts

- https://en.wikipedia.org/wiki/Invariant_(mathematics)#Invariants_in_computer_science
- https://en.wikipedia.org/wiki/Precondition
- https://en.wikipedia.org/wiki/Postcondition
- DbC https://en.wikipedia.org/wiki/Design_by_contract
- require vs assert https://ethereum.org/developers/docs/smart-contracts/security/#use-require-assert-revert
  - detect internal errors and check for violations of “invariants” in your code.
  - An invariant is a logical assertion about a contract’s state that should hold true for all function executions.
  - An example invariant is the maximum total supply or balance of a token contract.
  - Using assert() ensures that your state never reaches a wrong state
- https://standardschema.dev/schema
  - accumulating issues

error TS2775: Assertions require every name in the call target to be declared with an explicit type annotation. error
TS2776: Assertions require the call target to be an identifier or qualified name.

```ts
/////////////////////////////////////////////////
// extra semantic

// https://ethereum.org/developers/docs/smart-contracts/security/#use-require-assert-revert
// called at the start (...) )and ensures predefined conditions are met
// (...)) can be used to validate user inputs, check state variables, or authenticate
// before progressing with a function.
// NO: require is a reserved word. prefer assert_from(…).require or assert.pre(…)
//const require = assertⵧpre

// NO: prefer assert_from(…).ensure or assert.post(…)
//const ensure = assertⵧpost
```
